const express = require("express");
const { index, update, store, destroy, getMyProducts} = require("../controllers/product.controller");
const router = express.Router();
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");
const upload = require('../utils/upload');

router.get("/", verifyToken, index);
router.get("/myproduct", verifyToken, getMyProducts);
router.post("/", verifyToken, upload.single('foto'), store);
router.put("/:id", verifyToken, upload.single('foto'), update);
router.delete('/:id', verifyToken, upload.single('foto'), destroy);

module.exports = router;
