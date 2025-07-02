const express = require("express");
const { index, update, store, destroy, count } = require("../controllers/penduduk.controller");
const router = express.Router();
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, index);
router.post("/", verifyToken, authorizeRole("admin"), store);
router.put("/:id", verifyToken, authorizeRole("admin"), update);
router.delete('/:id', verifyToken, authorizeRole("admin"), destroy);

router.get("/count", verifyToken, count);

module.exports = router;
