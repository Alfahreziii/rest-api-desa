const Berita = require("../models/berita");
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');

/**
 * GET /Berita
 */
const index = async (req, res) => {
  try {
    const Beritas = await Berita.query(); // ambil semua kolom dan semua data

    return res.send({
      message: "Success",
      data: Beritas,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Berita",
      error: err.message,
    });
  }
};

const store = async (req, res, next) => {
  try {
    const { judul, deskripsi } = req.body;

    // Validasi
    if (!judul || !deskripsi || !req.file) {
      return res.status(400).json({ message: 'Judul, deskripsi, dan foto wajib diisi' });
    }

    const newBerita = {
      judul,
      deskripsi,
      foto: req.file.filename  // atau simpan path lengkap: `uploads/${req.file.filename}`
    };

    const createdBerita = await Berita.query().insert(newBerita);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: createdBerita
    });

  } catch (err) {
    next(err);
  }
};



/**
 * PUT /Berita/:id
 */
const update = async (req, res) => {
  const { id } = req.params;

  const allowedFields = ["judul", "deskripsi"];

  try {
    // Cari data berita lama
    const berita = await Berita.query().findById(id);
    if (!berita) {
    // Hapus gambar yang kadung diupload
    if (req.file) {
        const uploadedPath = path.join(__dirname, '../../uploads', req.file.filename);
        if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
        }
    }

    return res.status(404).json({ message: "Berita not found" });
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
      if (berita.foto) {
        const oldPath = path.join(__dirname, '../../uploads', berita.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.foto = req.file.filename;
    }

    // Lakukan update
    await Berita.query().findById(id).patch(updateData);

    return res.json({ message: "Berita updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Berita",
      error: err.message,
    });
  }
};



/**
 * DELETE /Berita/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari data berita dulu
    const berita = await Berita.query().findById(id);
    if (!berita) {
      return res.status(404).json({ message: "Berita not found" });
    }

    // Hapus file gambar jika ada
    if (berita.foto) {
      const filePath = path.join(__dirname, '../../uploads', berita.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Hapus file
      }
    }

    // Hapus data dari database
    await Berita.query().deleteById(id);

    return res.json({ message: "Berita deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Berita",
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
