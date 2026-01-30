const User = require("../models/auth.user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    let emailSent = true;
    try {
      await sendEmail(user.email, token);
    } catch (err) {
      emailSent = false;
      console.error("Email not sent:", err);
    }

    res.status(201).json({
      message: emailSent
        ? "Registered successfully. Please verify your email"
        : "Registered successfully, but failed to send verification email. Please contact support.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// TEST EMAIL (debugging)
exports.testEmail = async (req, res) => {
  const email = req.query.email || process.env.EMAIL_USER;
  const token = "test-token-" + Date.now();
  try {
    await sendEmail(email, token);
    res.json({ success: true, message: `Test email sent to ${email}` });
  } catch (err) {
    console.error("Test email failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: err && err.message ? err.message : "Unknown error",
    });
  }
};
