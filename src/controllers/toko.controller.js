// controllers/tokoController.js
const Toko = require("../models/toko");
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../utils/config');
const dayjs = require('dayjs');

/**
 * GET /tokos
 */
const index = async (req, res) => {
  try {
    const tokos = await Toko.query().withGraphFetched('user');

    const formattedTokos = tokos.map(toko => ({
    id: toko.id,
    id_user: toko.id_user,
    nama_toko: toko.nama_toko,
    alamat: toko.alamat,
    foto: toko.foto,
    foto_ktp: toko.foto_ktp,
    no_hp: toko.no_hp,
    status: toko.status,
    created_at: toko.created_at,
    created_at_formatted: dayjs(toko.created_at).format('DD MMMM YYYY'),
    nama_pemilik: toko.user?.name || null,
    email: toko.user?.email || null,
    }));



    return res.send({
      message: "Success",
      data: formattedTokos,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Toko",
      error: err.message,
    });
  }
};

/**
 * POST /tokos
 */
const store = async (req, res) => {
  try {
    const { nama_toko, no_hp, alamat } = req.body;
    const userId = req.user.id;

    if ( !nama_toko || !no_hp || !req.files?.foto || !req.files?.foto_ktp || !alamat) {
      return res.status(400).json({ message: ' nama_toko, no_hp, alamat dan foto wajib diisi' });
    }

    const newToko = {
    id_user: userId,
    nama_toko,
    no_hp,
    alamat,
    foto: req.files.foto[0].filename,
    foto_ktp: req.files.foto_ktp[0].filename,
    status: "pending", // default status
    };

    const createdToko = await Toko.query().insert(newToko);

    return res.status(201).json({
      message: "Toko berhasil ditambahkan, tunggu verifikasi admin",
      data: createdToko
    });

  } catch (err) {
    ['foto', 'foto_ktp'].forEach(field => {
      if (req.files?.[field]) {
        const filePath = path.join(UPLOAD_DIR, req.files[field][0].filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    if (err.nativeError?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Setiap user hanya boleh memiliki satu toko" });
    }

    return res.status(500).json({
      message: "Error saat menambahkan Toko",
      error: err.message,
    });
  }
};

/**
 * PUT /tokos/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["nama_toko", "no_hp", "alamat"];

  try {
    const toko = await Toko.query().findById(id);
    if (!toko) {
      if (req.file) {
        const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }
      return res.status(404).json({ message: "Toko tidak ditemukan" });
    }

    // ✅ Cek apakah toko milik user yang sedang login
    if (toko.id_user !== req.user.id) {
      return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengubah toko ini" });
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

      if (toko.foto) {
        const oldPath = path.join(UPLOAD_DIR, toko.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.foto = req.file.filename;
    }

    await Toko.query().findById(id).patch(updateData);

    return res.json({ message: "Toko berhasil diperbarui" });

  } catch (err) {
    if (req.file?.filename) {
      const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }

    return res.status(500).json({
      message: "Error saat memperbarui Toko",
      error: err.message,
    });
  }
};


/**
 * DELETE /tokos/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const toko = await Toko.query().findById(id);
    if (!toko) {
      return res.status(404).json({ message: "Toko tidak ditemukan" });
    }

    if (toko.foto) {
      const filePath = path.join(UPLOAD_DIR, toko.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Toko.query().deleteById(id);

    return res.json({ message: "Toko berhasil dihapus" });
  } catch (err) {
    return res.status(500).json({
      message: "Error saat menghapus Toko",
      error: err.message,
    });
  }
};

const verifikasi = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["aktif", "nonaktif"].includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  try {
    await Toko.query().findById(id).patch({ status });
    return res.json({ message: `Status toko berhasil diubah menjadi ${status}` });
  } catch (err) {
    return res.status(500).json({ message: "Gagal memverifikasi toko", error: err.message });
  }
};
/**
 * GET /tokos/me
 */
const me = async (req, res) => {
  try {
    const userId = req.user.id;

    const toko = await Toko.query().findOne({ id_user: userId }).withGraphFetched('user');

    if (!toko) {
      return res.status(404).json({ message: "Toko belum dibuat oleh user ini" });
    }

    const formattedToko = {
      id: toko.id,
      id_user: toko.id_user,
      nama_toko: toko.nama_toko,
      alamat: toko.alamat,
      foto: toko.foto,
      foto_ktp: toko.foto_ktp,
      no_hp: toko.no_hp,
      status: toko.status,
      created_at: toko.created_at,
      created_at_formatted: dayjs(toko.created_at).format('DD MMMM YYYY'),
      nama_pemilik: toko.user?.name || null,
      email: toko.user?.email || null,
    };

    return res.json({
      message: "Data toko berhasil diambil",
      data: formattedToko
    });
  } catch (err) {
    return res.status(500).json({
      message: "Gagal mengambil data toko",
      error: err.message,
    });
  }
};


module.exports = {
  index,
  store,
  update,
  destroy,
  verifikasi,
  me,
};
