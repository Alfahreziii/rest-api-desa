const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ message: "Name, email, dan password wajib diisi." });
    }

    const existingUser = await UserModel.query().findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email sudah terdaftar." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const {
      nomor_kk = null,
      nomor_nik = null,
      tempat_lahir = null,
      tanggal_lahir = null,
      jenis_kelamin = null,
      pekerjaan = null,
      status = null,
      alamat_rt005 = null,
      alamat_ktp = null,
      role = "user",
    } = req.body;

    const newUser = {
      name,
      email,
      password: passwordHash,
      nomor_kk,
      nomor_nik,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      pekerjaan,
      status,
      alamat_rt005,
      alamat_ktp,
      role,
      email_verified_at: null,
      email_verification_token: verificationToken, // simpan token verifikasi di sini
    };

    const createdUser = await UserModel.query().insert(newUser);

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    const htmlContent = `
      <h3>Verifikasi Email</h3>
      <p>Silakan klik link berikut untuk memverifikasi akun kamu:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `;

    await sendEmail(email, "Verifikasi Email - Movie App", htmlContent);

    return res.status(201).send({
      message: "Registrasi berhasil. Silakan cek email untuk verifikasi.",
      data: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await UserModel.query().findOne({ email_verification_token: token });

    if (!user) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verifikasi Gagal</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-red-100 flex items-center justify-center h-screen">
          <div class="bg-white p-8 rounded shadow text-center max-w-md">
            <h2 class="text-2xl font-bold text-red-600 mb-4">Verifikasi Gagal</h2>
            <p class="text-gray-700 mb-6">Token verifikasi tidak valid atau sudah digunakan.</p>
            <a href="${process.env.CLIENT_URL}/" class="text-blue-600 hover:underline">Kembali ke beranda</a>
          </div>
        </body>
        </html>
      `);
    }

    const updatePayload = {
      email_verified_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      email_verification_token: null,
    };

    if (user.unverified_email) {
      updatePayload.email = user.unverified_email;
      updatePayload.unverified_email = null;
    }

    await UserModel.query().patch(updatePayload).where({ id: user.id });

    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verifikasi Berhasil</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-green-100 flex items-center justify-center h-screen">
        <div class="bg-white p-8 rounded shadow text-center max-w-md">
          <h2 class="text-2xl font-bold text-green-600 mb-4">Verifikasi Berhasil</h2>
          <p class="text-gray-700 mb-6">Email kamu berhasil diverifikasi. Kamu sekarang dapat login ke aplikasi.</p>
          <a href="${process.env.CLIENT_URL}/" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
            Login Sekarang
          </a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Error</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 flex items-center justify-center h-screen">
        <div class="bg-white p-8 rounded shadow text-center max-w-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Terjadi Kesalahan</h2>
          <p class="text-gray-700 mb-6">Gagal memproses verifikasi. Silakan coba lagi nanti.</p>
          <pre class="text-sm text-red-500">${err.message}</pre>
        </div>
      </body>
      </html>
    `);
  }
};




/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.query().findOne({ email });

    if (!user) {
      return res.status(401).send({
        message: "Email atau password salah",
        data: null,
      });
    }

    if (!user.email_verified_at) {
      return res.status(403).send({
        message: "Akun belum diverifikasi. Silakan cek email kamu.",
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Email atau password salah",
        data: null,
      });
    }

    const token = jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role // ← ini penting
    }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });


    return res.send({
      message: "Login berhasil",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.query().findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "Email tidak ditemukan." });
    }

    const resetToken = uuidv4();

    await UserModel.query().patch({
      password_reset_token: resetToken,
      password_reset_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }).where({ id: user.id });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <h3>Reset Password</h3>
      <p>Silakan klik link di bawah untuk mengganti password kamu:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    await sendEmail(email, "Reset Password", htmlContent);

    res.send({ message: "Email reset password telah dikirim." });
  } catch (err) {
    res.status(500).send({ message: "Gagal mengirim reset password", error: err.message });
  }
};

const resetPasswordPage = async (req, res) => {
  const { token } = req.query;

  // Kirim halaman HTML reset password
  return res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Password</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-blue-100 flex items-center justify-center h-screen">
      <form action="/api/auth/reset-password" method="POST" class="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 class="text-2xl font-bold text-blue-600 mb-4 text-center">Reset Password</h2>
        <input type="hidden" name="token" value="${token}" />
        <label class="block mb-2 font-semibold">Password Baru:</label>
        <input type="password" name="newPassword" required class="w-full p-2 border rounded mb-4" />
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">Ubah Password</button>
      </form>
    </body>
    </html>
  `);
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await UserModel.query().findOne({ password_reset_token: token });

    if (!user) {
      return res.status(400).send("Token tidak valid atau sudah kadaluarsa.");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.query()
      .patch({
        password: newHashedPassword,
        password_reset_token: null,
        password_reset_at: null
      })
      .where({ id: user.id });

    return res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Berhasil Diubah</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-green-100 flex items-center justify-center h-screen">
        <div class="bg-white p-8 rounded shadow text-center max-w-md">
          <h2 class="text-2xl font-bold text-green-600 mb-4">Password Berhasil Diubah</h2>
          <p class="text-gray-700 mb-6">Silakan login dengan password baru kamu.</p>
          <a href="${process.env.CLIENT_URL}//login" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Login Sekarang</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Terjadi kesalahan saat mereset password.");
  }
};

module.exports = { register, login, verifyEmail, forgotPassword, resetPasswordPage, resetPassword };
