const Cpiuran = require("../models/cpiuran");
/**
 * GET /cpiuran
 */
const index = async (req, res) => {
  try {
    const cpiurans = await Cpiuran.query();
    return res.send({
      message: "Success",
      data: cpiurans,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving CP Iuran",
      error: err.message,
    });
  }
};


/**
 * POST /cpiuran
 */
/**
 * POST /cpiuran
 */
const store = async (req, res, next) => {
  try {
    const { nama, no_hp } = req.body;

    if (!nama || !no_hp) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek apakah sudah ada data CP Iuran
    const existingData = await Cpiuran.query().first(); // Ambil satu data pertama
    if (existingData) {
      return res.status(409).json({
        message: "Data CP Iuran sudah ada. Hanya boleh satu data.",
        data: existingData,
      });
    }

    // Jika belum ada, buat baru
    const newCpiuran = { nama, no_hp };
    const created = await Cpiuran.query().insert(newCpiuran);

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
  const allowedFields = ["nama", "no_hp" ];

  try {
    const existing = await Cpiuran.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "CP Iuran not found" });
    }

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await Cpiuran.query().findById(id).patch(updateData);
    return res.json({ message: "CP Iuran updated successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error updating CP Iuran",
      error: err.message,
    });
  }
};

/**
 * DELETE /cpiuran/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Cpiuran.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "CP Iuran not found" });
    }

    await Cpiuran.query().deleteById(id);
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
};
