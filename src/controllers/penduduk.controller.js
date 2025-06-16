const Penduduk = require("../models/penduduk");

/**
 * GET /penduduk
 */
const index = async (req, res) => {
  try {
    const penduduks = await Penduduk.query();
    return res.send({
      message: "Success",
      data: penduduks,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving penduduk",
      error: err.message,
    });
  }
};

/**
 * POST /penduduk
 */
const store = async (req, res, next) => {
  try {
    const { alamat, status, nomor_kk, nomor_nik, nama, jenis_kelamin, tempat_lahir, tgl_lahir, umur, pekerjaan } = req.body;

    if (!alamat || !status || !nomor_kk || !nomor_nik || !nama || !jenis_kelamin || !tempat_lahir || !tgl_lahir || !umur || !pekerjaan) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newPenduduk = { alamat, status, nomor_kk, nomor_nik, nama, jenis_kelamin, tempat_lahir, tgl_lahir, umur, pekerjaan };
    const created = await Penduduk.query().insert(newPenduduk);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /penduduk/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["alamat", "status", "nomor_kk", "nomor_nik", "nama", "jenis_kelamin", "tempat_lahir", "tgl_lahir", "umur", "pekerjaan"];

  try {
    const existing = await Penduduk.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "penduduk not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Penduduk.query().findById(id).patch(updateData);
    return res.json({ message: "Penduduk updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating penduduk",
      error: err.message,
    });
  }
};

/**
 * DELETE /penduduk/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Penduduk.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "penduduk not found" });
    }

    await Penduduk.query().deleteById(id);
    return res.json({ message: "Penduduk deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Penduduk",
      error: err.message,
    });
  }
};

/**
 * GET /penduduk/count
 */
const count = async (req, res) => {
  try {
    const total = await Penduduk.query().resultSize();
    return res.json({ count: total });
  } catch (err) {
    return res.status(500).json({
      message: "Error getting penduduk count",
      error: err.message,
    });
  }
};


module.exports = {
  index,
  store,
  update,
  destroy,
  count,
};
