const Pengurus = require("../models/pengurus");
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../utils/config');

/**
 * GET /pengurus
 */
const index = async (req, res) => {
  try {
    const pengurus = await Pengurus.query()
      .withGraphFetched("jabatan_rel")
      .modifyGraph("jabatan_rel", builder => {
        builder.select("nama_jabatan");
      });

    const response = pengurus.map(penguruss => ({
      ...penguruss,
      jabatan: penguruss.jabatan_rel?.nama_jabatan || null,
    }));

    return res.send({
      message: "Success",
      data: response,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving pengurus",
      error: err.message,
    });
  }
};


/**
 * POST /pengurus
 */
const store = async (req, res, next) => {
  try {
    const { nama, jabatan, email, alamat, no_hp } = req.body;

    if (!nama || !jabatan || !email || !alamat || !no_hp || !req.file) {
      return res.status(400).json({ message: 'nama, jabatan, email, alamat, no hp dan foto wajib diisi' });
    }

    const newPengurus = {
      nama,
      jabatan: parseInt(jabatan, 10),
      email,
      alamat,
      no_hp,
      foto: req.file.filename
    };

    const createdPengurus = await Pengurus.query().insert(newPengurus);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: createdPengurus
    });

  } catch (err) {
    // Hapus file jika ada error dan file sudah di-upload
    if (req.file && req.file.filename) {
      const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }

    return res.status(500).json({
      message: "Error saat menambahkan pengurus",
      error: err.message,
    });
  }
};


/**
 * PUT /pengurus/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["nama", "jabatan", "email", "alamat", "no_hp"];

  try {
    const pengurus = await Pengurus.query().findById(id);
    if (!pengurus) {
      if (req.file) {
        const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }

      return res.status(404).json({ message: "pengurus not found" });
    }

    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = field === 'jabatan' ? parseInt(req.body[field], 10) : req.body[field];
      }
    });


    if (req.file) {
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];
      const ext = path.extname(req.file.originalname).toLowerCase();

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: "File harus berupa gambar (png/jpg/jpeg/gif)" });
      }

      if (pengurus.foto) {
        const oldPath = path.join(UPLOAD_DIR, pengurus.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.foto = req.file.filename;
    }

    await Pengurus.query().findById(id).patch(updateData);

    return res.json({ message: "Pengurus updated successfully" });

  } catch (err) {
    if (req.file && req.file.filename) {
      const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }

    return res.status(500).json({
      message: "Error updating Pengurus",
      error: err.message,
    });
  }
};

/**
 * DELETE /pengurus/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const pengurus = await Pengurus.query().findById(id);
    if (!pengurus) {
      return res.status(404).json({ message: "pengurus not found" });
    }

    if (pengurus.foto) {
      const filePath = path.join(UPLOAD_DIR, pengurus.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Pengurus.query().deleteById(id);

    return res.json({ message: "Pengurus deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Pengurus",
      error: err.message,
    });
  }
};
/**
 * GET /pengurus/count
 */
const count = async (req, res) => {
  try {
    const total = await Pengurus.query().resultSize();
    return res.json({ count: total });
  } catch (err) {
    return res.status(500).json({
      message: "Error getting pengurus count",
      error: err.message,
    });
  }
};


module.exports = {
  index,
  update,
  destroy,
  store,
  count,
};
