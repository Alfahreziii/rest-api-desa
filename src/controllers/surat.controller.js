const Surat = require("../models/surat");

/**
 * GET /surat
 */
const index = async (req, res) => {
  try {
    const surats = await Surat.query()
      .withGraphFetched('jenisSurat') // Melakukan join ke jenis_surat
      .modifyGraph('jenisSurat', builder => {
        builder.select('nama_jenis'); // Hanya mengambil nama_jenis dari jenis_surat
      });

    // Modifikasi response untuk menampilkan nama jenis surat
    const response = surats.map(surat => ({
      ...surat,
      id_jenissurat: surat.jenisSurat?.nama_jenis || surat.id_jenissurat, // Ganti id_jenissurat dengan nama_jenis
    }));

    return res.send({
      message: "Success",
      data: response,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving surat",
      error: err.message,
    });
  }
};

/**
 * POST /surat
 */
const store = async (req, res, next) => {
  try {
    const { atas_nama, ditunjukan, id_jenissurat, keterangan } = req.body;

    if (!atas_nama || !ditunjukan || !id_jenissurat || !keterangan) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const newSurat = { atas_nama, ditunjukan, id_jenissurat, keterangan };
    const created = await Surat.query().insert(newSurat);

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
  const allowedFields = ["atas_nama", "ditunjukan", "id_jenissurat", "keterangan",","];

  try {
    const existing = await Surat.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Surat not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Surat.query().findById(id).patch(updateData);
    return res.json({ message: "Surat updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating Surat",
      error: err.message,
    });
  }
};

/**
 * DELETE /surat/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Surat.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Surat not found" });
    }

    await Surat.query().deleteById(id);
    return res.json({ message: "Surat deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Surat",
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
