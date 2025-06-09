const User = require("../models/user");
const bcrypt = require('bcryptjs');

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

/**
 * PUT /users/:id
 */
const update = async (req, res) => {
  const { id } = req.params;

  // Field yang boleh diupdate sesuai jsonSchema kecuali yang auto atau sensitif
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

    // Ambil hanya field yang ada di allowedFields dari req.body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Jika password diberikan, hash terlebih dahulu
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await User.query().findById(id).patch(updateData);

    if (updated) {
      return res.send({ message: "User updated successfully" });
    }

    return res.status(404).send({ message: "User not found" });
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
};
