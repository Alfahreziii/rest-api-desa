const Berita = require("../models/berita");
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../utils/config');
const dayjs = require('dayjs');

/**
 * GET /Berita
 */
const index = async (req, res) => {
  try {
    const Beritas = await Berita.query();

    const formattedBeritas = Beritas.map(berita => ({
      ...berita,
      created_at_formatted: dayjs(berita.created_at).format('DD MMMM YYYY'),
    }));

    return res.send({
      message: "Success",
      data: formattedBeritas,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Berita",
      error: err.message,
    });
  }
};

/**
 * POST /Berita
 */
const store = async (req, res, next) => {
  try {
    const { judul, deskripsi } = req.body;

    if (!judul || !deskripsi || !req.file) {
      return res.status(400).json({ message: 'Judul, deskripsi, dan foto wajib diisi' });
    }

    const newBerita = {
      judul,
      deskripsi,
      foto: req.file.filename
    };

    const createdBerita = await Berita.query().insert(newBerita);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: createdBerita
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
      message: "Error saat menambahkan berita",
      error: err.message,
    });
  }
};


/**
 * PUT /Berita/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["judul", "deskripsi"];

  try {
    const berita = await Berita.query().findById(id);
    if (!berita) {
      if (req.file) {
        const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }

      return res.status(404).json({ message: "Berita not found" });
    }

    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.file) {
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];
      const ext = path.extname(req.file.originalname).toLowerCase();

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: "File harus berupa gambar (png/jpg/jpeg/gif)" });
      }

      if (berita.foto) {
        const oldPath = path.join(UPLOAD_DIR, berita.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.foto = req.file.filename;
    }

    await Berita.query().findById(id).patch(updateData);

    return res.json({ message: "Berita updated successfully" });

  } catch (err) {
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
    const berita = await Berita.query().findById(id);
    if (!berita) {
      return res.status(404).json({ message: "Berita not found" });
    }

    if (berita.foto) {
      const filePath = path.join(UPLOAD_DIR, berita.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
