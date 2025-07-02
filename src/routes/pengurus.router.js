const express = require("express");
const { index, update, store, destroy, count } = require("../controllers/pengurus.controller");
const router = express.Router();
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");
const upload = require('../utils/upload');

router.get("/", verifyToken, index);
router.post("/", verifyToken, upload.single('foto'), authorizeRole("admin"), store);
router.put("/:id", verifyToken, upload.single('foto'), authorizeRole("admin"), update);
router.delete('/:id', verifyToken, upload.single('foto'), authorizeRole("admin"), destroy);

router.get("/count", verifyToken, count);

module.exports = router;
