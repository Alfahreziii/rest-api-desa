const Tahlil = require("../models/tahlil");

/**
 * GET /Tahlil
 */
const index = async (req, res) => {
  try {
    const tahlils = await Tahlil.query();
    return res.send({
      message: "Success",
      data: tahlils,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Tahlil",
      error: err.message,
    });
  }
};

/**
 * POST /Tahlil
 */
const store = async (req, res, next) => {
  try {
    const { hari, jam_mulai, jam_selesai, tempat, ustadzah } = req.body;

    if (!hari || !jam_mulai || !jam_selesai || !tempat || !ustadzah) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newTahlil = { hari, jam_mulai, jam_selesai, tempat, ustadzah };
    const created = await Tahlil.query().insert(newTahlil);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /Tahlil/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["hari", "jam_mulai", "jam_selesai", "tempat", "ustadzah"];

  try {
    const existing = await Tahlil.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Tahlil not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Tahlil.query().findById(id).patch(updateData);
    return res.json({ message: "Tahlil updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Tahlil",
      error: err.message,
    });
  }
};

/**
 * DELETE /Tahlil/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Tahlil.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Tahlil not found" });
    }

    await Tahlil.query().deleteById(id);
    return res.json({ message: "Tahlil deleted successfully" });

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
