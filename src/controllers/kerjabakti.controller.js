const Kerjabakti = require("../models/kerjabakti");

/**
 * GET /Kerjabakti
 */
const index = async (req, res) => {
  try {
    const kerjabaktis = await Kerjabakti.query();
    return res.send({
      message: "Success",
      data: kerjabaktis,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Pengajian",
      error: err.message,
    });
  }
};

/**
 * POST /Kerjabakti
 */
const store = async (req, res, next) => {
  try {
    const { hari, jam_mulai, jam_selesai, tempat, peserta } = req.body;

    if (!hari || !jam_mulai || !jam_selesai || !tempat || !peserta) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newKerjabakti = { hari, jam_mulai, jam_selesai, tempat, peserta };
    const created = await Kerjabakti.query().insert(newKerjabakti);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /Kerjabakti/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["hari", "jam_mulai", "jam_selesai", "tempat", "peserta"];

  try {
    const existing = await Kerjabakti.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Kerja Bakti not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Kerjabakti.query().findById(id).patch(updateData);
    return res.json({ message: "Kerja Bakti updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Kerja Bakti",
      error: err.message,
    });
  }
};

/**
 * DELETE /Kerjabakti/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Kerjabakti.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Kerja Bakti not found" });
    }

    await Kerjabakti.query().deleteById(id);
    return res.json({ message: "Kerja Bakti deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Kerja Bakti",
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
