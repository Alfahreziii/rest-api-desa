const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid"); 
const sendEmail = require("../utils/sendEmail"); 

/**
 * GET /users
 */
const index = async (req, res) => {
  try {
    const users = await User.query(); // ambil semua kolom dan semua data

    return res.send({
      message: "Success",
      data: users,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving users",
      error: err.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await User.query().findById(userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        data: null,
      });
    }

    // Hapus password sebelum dikirim ke client
    delete user.password;

    res.send({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error fetching profile",
      error: err.message,
    });
  }
};



/**
 * PUT /users/:id
 */
const update = async (req, res) => {
  const { id } = req.params;

  const allowedFields = [
    "name",
    "email",
    "password",
    "nomor_kk",
    "nomor_nik",
    "tempat_lahir",
    "tanggal_lahir",
    "jenis_kelamin",
    "pekerjaan",
    "status",
    "alamat_rt005",
    "alamat_ktp",
    "role",
    "remember_token"
  ];

  try {
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Cek user lama
    const user = await User.query().findById(id);
    if (!user) return res.status(404).send({ message: "User not found" });

    // Jika password diberikan
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Jika email diubah
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.query()
        .where('email', updateData.email)
        .orWhere('unverified_email', updateData.email)
        .whereNot('id', id)
        .first();

      if (existingUser) {
        return res.status(400).send({
          message: "Email sudah digunakan oleh pengguna lain.",
        });
      }
      const token = uuidv4();
      updateData.unverified_email = updateData.email;
      updateData.email_verification_token = token;

      // Jangan langsung ubah email lama
      delete updateData.email;

      // Kirim email verifikasi
      const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
      const htmlContent = `
        <h3>Verifikasi Email</h3>
        <p>Silakan klik link berikut untuk memverifikasi akun kamu:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `;
      await sendEmail(updateData.unverified_email, "Verifikasi Email - Movie App", htmlContent);

      // Tambahkan response untuk memberi tahu user
      await User.query().findById(id).patch(updateData);
      return res.send({
        message: "Link verifikasi telah dikirim ke email baru. Verifikasi untuk mengaktifkan.",
      });
    }

    // Update data biasa
    await User.query().findById(id).patch(updateData);
    return res.send({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).send({
      message: "Error updating user",
      error: err.message,
    });
  }
};


/**
 * DELETE /users/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.query().deleteById(id);

    if (deleted) {
      return res.send({ message: "User deleted successfully" });
    }

    return res.status(404).send({ message: "User not found" });
  } catch (err) {
    return res.status(500).send({
      message: "Error deleting user",
      error: err.message,
    });
  }
};

module.exports = {
  index,
  update,
  destroy,
  getProfile,
};
