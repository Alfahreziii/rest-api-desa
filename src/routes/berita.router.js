const express = require("express");
const { index, update, store, destroy } = require("../controllers/berita.controller");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const upload = require('../utils/upload');

router.get("/", verifyToken, index);
router.post("/", verifyToken, upload.single('foto'), store);
router.put("/:id", verifyToken, upload.single('foto'), update);
router.delete('/:id', verifyToken, upload.single('foto'), destroy);

module.exports = router;
