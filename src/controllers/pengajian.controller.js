const Pengajian = require("../models/pengajian");

/**
 * GET /Pengajian
 */
const index = async (req, res) => {
  try {
    const pengajians = await Pengajian.query();
    return res.send({
      message: "Success",
      data: pengajians,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Pengajian",
      error: err.message,
    });
  }
};

/**
 * POST /Pengajian
 */
const store = async (req, res, next) => {
  try {
    const { hari, jam_mulai, jam_selesai, tempat, ustadzah } = req.body;

    if (!hari || !jam_mulai || !jam_selesai || !tempat || !ustadzah) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newPengajian = { hari, jam_mulai, jam_selesai, tempat, ustadzah };
    const created = await Pengajian.query().insert(newPengajian);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /Pengajian/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["hari", "jam_mulai", "jam_selesai", "tempat", "ustadzah"];

  try {
    const existing = await Pengajian.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Pengajian not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Pengajian.query().findById(id).patch(updateData);
    return res.json({ message: "Pengajian updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Pengajian",
      error: err.message,
    });
  }
};

/**
 * DELETE /Pengajian/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Pengajian.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Pengajian not found" });
    }

    await Pengajian.query().deleteById(id);
    return res.json({ message: "Pengajian deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Pengajian",
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
