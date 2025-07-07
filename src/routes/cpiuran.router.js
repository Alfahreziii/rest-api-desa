const express = require("express");
const { index, update, store } = require("../controllers/cpiuran.controller");
const router = express.Router();
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, index);
router.post("/", verifyToken, authorizeRole("admin"), store);
router.put("/:id", verifyToken, authorizeRole("admin"), update);

module.exports = router;
