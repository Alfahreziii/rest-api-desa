const express = require("express");

const router = express.Router();

const { validateLogin, validateRegister } = require("../middlewares/validator");
const { login, register, verifyEmail } = require("../controllers/auth.controller");

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);
router.get("/verify-email", verifyEmail);

module.exports = router;
