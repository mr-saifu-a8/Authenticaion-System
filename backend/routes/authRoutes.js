const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  testEmail,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.get("/test-email", testEmail);

module.exports = router;
