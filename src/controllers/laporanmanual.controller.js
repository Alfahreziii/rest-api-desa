const LaporanManual = require("../models/laporanmanual");

/**
 * GET /laporan manual
 */
const index = async (req, res) => {
  try {
    const laporanmanuals = await LaporanManual.query();
    return res.send({
      message: "Success",
      data: laporanmanuals,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Laporan Manual",
      error: err.message,
    });
  }
};

/**
 * POST /laporanmanual
 */
const store = async (req, res, next) => {
  try {
    const { jumlah_rumah, jumlah_meninggal, jumlah_pindah } = req.body;

    if (!jumlah_rumah || !jumlah_meninggal || !jumlah_pindah) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Ambil bulan dan tahun saat ini
    const today = new Date();
    const bulan_tahun = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`; // format YYYY-MM

    // 🔍 Cek apakah laporan di bulan_tahun ini sudah ada
    const existing = await LaporanManual.query().where("bulan_tahun", bulan_tahun).first();
    if (existing) {
      return res.status(400).json({ message: `Laporan untuk bulan ${bulan_tahun} sudah ada.` });
    }

    // 📝 Jika belum ada, simpan laporan baru
    const newLaporanManual = {
      jumlah_rumah,
      jumlah_meninggal,
      jumlah_pindah,
      bulan_tahun
    };

    const created = await LaporanManual.query().insert(newLaporanManual);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};



/**
 * PUT /laporanmanual/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["jumlah_rumah", "jumlah_meninggal", "jumlah_pindah"];

  try {
    const existing = await LaporanManual.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Laporan Manual not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await LaporanManual.query().findById(id).patch(updateData);
    return res.json({ message: "Laporan Manual updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Laporan Manual",
      error: err.message,
    });
  }
};

/**
 * DELETE /laporanmanual/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await LaporanManual.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Laporan Manual not found" });
    }

    await LaporanManual.query().deleteById(id);
    return res.json({ message: "Laporan Manual deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Laporan Manual",
      error: err.message,
    });
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
};
