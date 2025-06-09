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
      remember_token: verificationToken, // simpan token verifikasi di sini
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
    const user = await UserModel.query().findOne({ remember_token: token });

    if (!user) {
      return res.status(400).send({ message: "Token verifikasi tidak valid." });
    }

    await UserModel.query()
      .patch({
        email_verified_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        remember_token: null, // hapus token setelah verifikasi
      })
      .where({ id: user.id });

    return res.send({ message: "Email berhasil diverifikasi." });
  } catch (err) {
    return res.status(500).send({ message: "Verifikasi gagal", error: err.message });
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

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    return res.send({
      message: "Login berhasil",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, verifyEmail };
