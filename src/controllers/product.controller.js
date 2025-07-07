const Product = require("../models/product");
const Toko = require('../models/toko'); // import model toko
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../utils/config');

const index = async (req, res) => {
  try {
    const products = await Product.query()
      .joinRelated('toko') // join ke tabel toko
      .where('toko.status', 'aktif') // hanya toko dengan status aktif
      .select('products.*') // pilih semua kolom dari product
      .withGraphFetched("toko");

    const formatted = products.map((p) => ({
      id: p.id,
      id_toko: p.id_toko,
      nama_produk: p.nama_produk,
      deskripsi: p.deskripsi,
      harga: p.harga,
      stok: p.stok,
      foto: p.foto,
      no_hp_toko: p.toko?.no_hp || null,
    }));

    res.json({ message: "Success", data: formatted });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil produk", error: err.message });
  }
};


const getMyProducts = async (req, res) => {
  try {
    // 1. Cari toko milik user login
    const toko = await Toko.query().findOne({ id_user: req.user.id });

    if (!toko) {
      return res.status(404).json({ message: "Toko tidak ditemukan untuk user ini" });
    }

    // 2. Ambil semua produk berdasarkan id_toko
    const products = await Product.query()
      .where('id_toko', toko.id)
      .withGraphFetched("toko");

    // 3. Format output
    const formatted = products.map((p) => ({
      id: p.id,
      nama_produk: p.nama_produk,
      deskripsi: p.deskripsi,
      harga: p.harga,
      stok: p.stok,
      foto: p.foto,
      no_hp_toko: p.toko?.no_hp || null,
    }));

    return res.json({ message: "Produk milik Anda", data: formatted });
  } catch (err) {
    return res.status(500).json({
      message: "Gagal mengambil produk user",
      error: err.message,
    });
  }
};


/**
 * POST /product
 */

const store = async (req, res, next) => {
  try {
    const { nama_produk, deskripsi, harga, stok } = req.body;

    if (!nama_produk || !deskripsi || !harga || !stok || !req.file) {
      return res.status(400).json({ message: 'nama_produk, deskripsi, dan foto wajib diisi' });
    }

    // Ambil ID toko berdasarkan user login (id_user)
    const toko = await Toko.query().findOne({ id_user: req.user.id });

    if (!toko) {
      return res.status(404).json({ message: 'Toko untuk user ini tidak ditemukan' });
    }

    const newProduct = {
      nama_produk,
      deskripsi,
      harga: parseInt(harga, 10),
      stok: parseInt(stok, 10),
      id_toko: toko.id, // dari relasi user → toko
      foto: req.file.filename
    };

    const createdProduct = await Product.query().insert(newProduct);

    return res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: createdProduct
    });

  } catch (err) {
    if (req.file && req.file.filename) {
      const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }

    return res.status(500).json({
      message: "Error saat menambahkan product",
      error: err.message,
    });
  }
};



/**
 * PUT /product/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["nama_produk", "deskripsi", "harga", "stok"];

  try {
    // 1. Ambil produk
    const product = await Product.query().findById(id);
    if (!product) {
      if (req.file) {
        const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }

      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Ambil toko milik user login
    const toko = await Toko.query().findOne({ id_user: req.user.id });
    if (!toko) {
      return res.status(403).json({ message: "User tidak memiliki toko" });
    }

    // 3. Cek apakah produk milik toko user
    if (product.id_toko !== toko.id) {
      return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengedit produk ini" });
    }

    // 4. Siapkan data update
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === "harga" || field === "stok") {
          updateData[field] = parseInt(req.body[field], 10);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });


    // 5. Cek dan ganti foto jika ada
    if (req.file) {
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];
      const ext = path.extname(req.file.originalname).toLowerCase();

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: "File harus berupa gambar (png/jpg/jpeg/gif)" });
      }

      if (product.foto) {
        const oldPath = path.join(UPLOAD_DIR, product.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updateData.foto = req.file.filename;
    }

    // 6. Update produk
    await Product.query().findById(id).patch(updateData);

    return res.json({ message: "Product updated successfully" });

  } catch (err) {
    if (req.file && req.file.filename) {
      const uploadedPath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }
    }

    if (err.nativeError && err.nativeError.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Deskripsi sudah digunakan (duplikat)" });
    }

    return res.status(500).json({
      message: "Error updating Product",
      error: err.message,
    });
  }
};


/**
 * DELETE /product/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Ambil produk
    const product = await Product.query().findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Ambil toko milik user login
    const toko = await Toko.query().findOne({ id_user: req.user.id });
    if (!toko) {
      return res.status(403).json({ message: "User tidak memiliki toko" });
    }

    // 3. Cek apakah produk tersebut milik toko user
    if (product.id_toko !== toko.id) {
      return res.status(403).json({ message: "Anda tidak memiliki izin untuk menghapus produk ini" });
    }

    // 4. Hapus file gambar jika ada
    if (product.foto) {
      const filePath = path.join(UPLOAD_DIR, product.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 5. Hapus produk
    await Product.query().deleteById(id);

    return res.json({ message: "Product deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Product",
      error: err.message,
    });
  }
};


module.exports = {
  index,
  store,
  update,
  destroy,
  getMyProducts
};