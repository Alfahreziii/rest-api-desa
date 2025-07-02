const express = require("express");
const { index, update, store, destroy, verifikasi } = require("../controllers/toko.controller");
const router = express.Router();
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");
const upload = require('../utils/upload');

router.get("/", verifyToken, index);
router.get("/me", verifyToken, index);
router.post("/", verifyToken, upload.fields([{ name: 'foto' }, { name: 'foto_ktp' }]), store);
router.put("/:id", verifyToken, upload.single('foto'), update);
router.delete('/:id', verifyToken, upload.single('foto'), authorizeRole("admin"), destroy);
router.put("/:id/verifikasi", verifyToken, authorizeRole("admin"), verifikasi);

module.exports = router;
