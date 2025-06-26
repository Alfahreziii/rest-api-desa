const Jabatan = require("../models/jabatan");

/**
 * GET /jabatan
 */
const index = async (req, res) => {
  try {
    const jabatan = await Jabatan.query();
    return res.send({
      message: "Success",
      data: jabatan,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Jabatan",
      error: err.message,
    });
  }
};

/**
 * POST /jabatan
 */
const store = async (req, res, next) => {
  try {
    const { nama_jabatan } = req.body;

    if (!nama_jabatan) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newJabatan = { nama_jabatan };
    const created = await Jabatan.query().insert(newJabatan);

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
  const allowedFields = ["nama_jabatan"];

  try {
    const existing = await Jabatan.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Jabatan not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Jabatan.query().findById(id).patch(updateData);
    return res.json({ message: "Jabatan updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Jabatan",
      error: err.message,
    });
  }
};

/**
 * DELETE /  surat/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Jabatan.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Jabatan not found" });
    }

    await Jabatan.query().deleteById(id);
    return res.json({ message: "Jabatan deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Jabatan",
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
