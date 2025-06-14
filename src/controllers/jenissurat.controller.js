const JenisSurat = require("../models/jenissurat");

/**
 * GET /jenis surat
 */
const index = async (req, res) => {
  try {
    const jenissurats = await JenisSurat.query();
    return res.send({
      message: "Success",
      data: jenissurats,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving jenis surat",
      error: err.message,
    });
  }
};

/**
 * POST /Jenis surat
 */
const store = async (req, res, next) => {
  try {
    const { nama_jenis } = req.body;

    if (!nama_jenis) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newJenissurat = { nama_jenis };
    const created = await JenisSurat.query().insert(newJenissurat);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: created,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PUT /surat/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["nama_jenis"];

  try {
    const existing = await JenisSurat.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Jenis Surat not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await JenisSurat.query().findById(id).patch(updateData);
    return res.json({ message: "Jenis Surat updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Jenis Surat",
      error: err.message,
    });
  }
};

/**
 * DELETE /jenis surat/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await JenisSurat.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Jenis surat not found" });
    }

    await JenisSurat.query().deleteById(id);
    return res.json({ message: "Jenis Surat deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Jenis surat",
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
