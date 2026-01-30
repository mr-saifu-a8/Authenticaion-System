const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
  // Configure SMTP explicitly and verify connection before sending
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection configuration
  try {
    await transporter.verify();
  } catch (err) {
    console.error("Email transporter verification failed:", err);
    throw new Error("Email transporter verification failed");
  }

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${FRONTEND_URL}/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Click the link to verify your email:</p><a href="${link}">${link}</a><p>If the link does not open, copy & paste the link into your browser.</p>`,
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
    throw err; // bubble up so caller can handle
  }
};

module.exports = sendEmail;
