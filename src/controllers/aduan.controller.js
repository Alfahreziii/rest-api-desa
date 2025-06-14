const Aduan = require("../models/aduan");
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../utils/config');

/**
 * GET /aduan
 */
const index = async (req, res) => {
  try {
    const Aduans = await Aduan.query(); // ambil semua kolom dan semua data

    return res.send({
      message: "Success",
      data: Aduans,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving aduan",
      error: err.message,
    });
  }
};

const store = async (req, res, next) => {
  try {
    const { judul, keterangan } = req.body;

    // Validasi
    if (!judul || !keterangan || !req.file) {
      return res.status(400).json({ message: 'Judul, keterangan, dan foto wajib diisi' });
    }

    const newAduan = {
      judul,
      keterangan,
      foto: req.file.filename  // atau simpan path lengkap: `uploads/${req.file.filename}`
    };

    const createdAduan = await Aduan.query().insert(newAduan);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: createdAduan
    });

  } catch (err) {
        // Hapus file jika ada error dan file sudah di-upload
    if (req.file && req.file.filename) {
      const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }

    // Tangani error unik
    if (err.nativeError && err.nativeError.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Deskripsi sudah digunakan (duplikat)" });
    }

    return res.status(500).json({
      message: "Error saat menambahkan aduan",
      error: err.message,
    });
  }
};



/**
 * PUT /aduan/:id
 */
const update = async (req, res) => {
  const { id } = req.params;

  const allowedFields = ["judul", "keterangan"];

  try {
    // Cari data aduan lama
    const aduan = await Aduan.query().findById(id);
    if (!aduan) {
    // Hapus gambar yang kadung diupload
    if (req.file) {
        const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
        if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
        }
    }

    return res.status(404).json({ message: "Aduan not found" });
}

    const updateData = {};

    // Ambil field dari req.body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Jika ada file foto baru diupload
    if (req.file) {
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];
      const ext = path.extname(req.file.originalname).toLowerCase();

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: "File harus berupa gambar (png/jpg/jpeg/gif)" });
      }

      // Hapus file lama jika ada
      if (aduan.foto) {
        const oldPath = path.join(UPLOAD_DIR, aduan.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.foto = req.file.filename;
    }

    // Lakukan update
    await Aduan.query().findById(id).patch(updateData);

    return res.json({ message: "aduan updated successfully" });

  } catch (err) {
        // Hapus file jika ada error dan file sudah di-upload
    if (req.file && req.file.filename) {
      const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }

    // Tangani error unik
    if (err.nativeError && err.nativeError.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Deskripsi sudah digunakan (duplikat)" });
    }
    return res.status(500).json({
      message: "Error updating aduan",
      error: err.message,
    });
  }
};



/**
 * DELETE /aduan/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari data aduan dulu
    const aduan = await Aduan.query().findById(id);
    if (!aduan) {
      return res.status(404).json({ message: "Aduan not found" });
    }

    // Hapus file gambar jika ada
    if (aduan.foto) {
      const filePath = path.join(UPLOAD_DIR, aduan.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Hapus file
      }
    }

    // Hapus data dari database
    await Aduan.query().deleteById(id);

    return res.json({ message: "aduan deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting aduan",
      error: err.message,
    });
  }
};

module.exports = {
  index,
  update,
  destroy,
  store,
};
