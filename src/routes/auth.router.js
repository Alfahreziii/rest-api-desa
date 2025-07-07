const express = require("express");

const router = express.Router();

const { validateLogin, validateRegister } = require("../middlewares/validator");
const { register, login, verifyEmail, forgotPassword, resetPasswordPage, resetPassword } = require("../controllers/auth.controller");

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password", resetPasswordPage); // kirim form HTML
router.post("/reset-password", resetPassword); 

module.exports = router;
