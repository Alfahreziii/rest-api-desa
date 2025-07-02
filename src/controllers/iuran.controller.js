const Iuran = require("../models/iuran");
const Pembayaran = require('../models/pembayaran');
/**
 * GET /iuran
 */
const index = async (req, res) => {
  try {
    const iurans = await Iuran.query();
    return res.send({
      message: "Success",
      data: iurans,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Iuran",
      error: err.message,
    });
  }
};

const getIuranWithStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil semua iuran
    const iuranList = await Iuran.query();

    // Ambil semua pembayaran user yang statusnya Lunas
    const pembayaranLunas = await Pembayaran.query()
      .where('user_id', userId)
      .where('status', 'Lunas');

    // Buat set berisi iuran_id yang sudah dibayar lunas
    const iuranLunasSet = new Set(pembayaranLunas.map(p => p.iuran_id));

    // Gabungkan data
    const result = iuranList.map(iuran => ({
      id: iuran.id,
      bulan: iuran.bulan,
      harga: iuran.harga,
      status: iuranLunasSet.has(iuran.id) ? 'lunas' : 'belum dibayar',
    }));

    return res.send({
      message: 'Success',
      data: result,
    });
  } catch (err) {
    return res.status(500).send({
      message: 'Gagal mengambil data iuran',
      error: err.message,
    });
  }
};


/**
 * POST /Iuran
 */
const store = async (req, res, next) => {
  try {
    const { bulan, harga, jatuh_tempo } = req.body;

    if (!bulan || !harga || !jatuh_tempo ) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newIuran = { bulan, harga, jatuh_tempo };
    const created = await Iuran.query().insert(newIuran);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /iuran/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["bulan", "harga", "jatuh_tempo" ];

  try {
    const existing = await Iuran.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Iuran not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Iuran.query().findById(id).patch(updateData);
    return res.json({ message: "Iuran updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Iuran",
      error: err.message,
    });
  }
};

/**
 * DELETE /iuran/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Iuran.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Iuran not found" });
    }

    await Iuran.query().deleteById(id);
    return res.json({ message: "Iuran deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Iuran",
      error: err.message,
    });
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
  getIuranWithStatus,
};
