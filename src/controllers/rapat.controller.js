const Rapat = require("../models/rapat");
const dayjs = require('dayjs');

/**
 * GET /rapat
 */
const index = async (req, res) => {
  try {
    const rapats = await Rapat.query();

    const formattedRapats = rapats.map(rapat => ({
      ...rapat,
      created_at_formatted: dayjs(rapat.created_at).format('DD MMMM YYYY'),
    }));
    return res.send({
      message: "Success",
      data: formattedRapats,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Pengajian",
      error: err.message,
    });
  }
};

/**
 * POST /rapat
 */
const store = async (req, res, next) => {
  try {
    const { judul, hari, jam_mulai, jam_selesai, tempat, peserta, bahasan } = req.body;

    if (!judul || !hari || !jam_mulai || !jam_selesai || !tempat || !peserta || !bahasan) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newRapat = { judul, hari, jam_mulai, jam_selesai, tempat, peserta, bahasan };
    const created = await Rapat.query().insert(newRapat);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /rapat/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["judul", "hari", "jam_mulai", "jam_selesai", "tempat", "peserta", "bahasan"];

  try {
    const existing = await Rapat.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Rapat not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Rapat.query().findById(id).patch(updateData);
    return res.json({ message: "Rapat updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Rapat",
      error: err.message,
    });
  }
};

/**
 * DELETE /rapat/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Rapat.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Rapat not found" });
    }

    await Rapat.query().deleteById(id);
    return res.json({ message: "Rapat deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Rapat",
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
