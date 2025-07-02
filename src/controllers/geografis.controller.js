const Geografis = require("../models/geografis");
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../utils/config');
const dayjs = require('dayjs');

/**
 * GET /geografis
 */
const index = async (req, res) => {
  try {
    const Geografiss = await Geografis.query();

    const formattedGeografiss = Geografiss.map(geografis => ({
      ...geografis,
      created_at_formatted: dayjs(geografis.created_at).format('DD MMMM YYYY'),
    }));

    return res.send({
      message: "Success",
      data: formattedGeografiss,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Geografis",
      error: err.message,
    });
  }
};

/**
 * POST /geografis
 */
const store = async (req, res, next) => {
  try {
    const { judul } = req.body;

    if (!judul || !req.file) {
      return res.status(400).json({ message: 'Judul, dan foto wajib diisi' });
    }

    const newGeografis = {
      judul,
      foto: req.file.filename
    };

    const createdGeografis = await Geografis.query().insert(newGeografis);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: createdGeografis
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
      message: "Error saat menambahkan geografis",
      error: err.message,
    });
  }
};


/**
 * PUT /geografiss/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["judul"];

  try {
    const geografis = await Geografis.query().findById(id);
    if (!geografis) {
      if (req.file) {
        const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }

      return res.status(404).json({ message: "Geografis not found" });
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

      if (geografis.foto) {
        const oldPath = path.join(UPLOAD_DIR, geografis.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.foto = req.file.filename;
    }

    await Geografis.query().findById(id).patch(updateData);

    return res.json({ message: "Geografis updated successfully" });

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
      message: "Error updating Geografis",
      error: err.message,
    });
  }
};

/**
 * DELETE /geografis/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const geografis = await Geografis.query().findById(id);
    if (!geografis) {
      return res.status(404).json({ message: "Geografis not found" });
    }

    if (geografis.foto) {
      const filePath = path.join(UPLOAD_DIR, geografis.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Geografis.query().deleteById(id);

    return res.json({ message: "geografis deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting geografis",
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
