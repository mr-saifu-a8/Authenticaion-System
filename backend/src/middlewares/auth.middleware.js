import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // 🔹 Step 1: Header se authorization lo
  const authHeader = req.headers.authorization;

  // 🔹 Step 2: Check karo token aaya hai ya nahi
  if (!authHeader) {
    // agar token nahi hai → access deny
    return res.status(401).json({ message: "No token" });
  }

  // 🔹 Step 3: "Bearer token" me se actual token nikaalo
  const token = authHeader.split(" ")[1];

  try {
    // 🔹 Step 4: Token verify karo (valid hai ya nahi)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Step 5: decoded data (user id) ko request me save karo
    // taaki next controller use kar sake
    req.user = decoded;

    // 🔹 Step 6: Sab sahi hai → next function call karo
    next();
  } catch (error) {
    // 🔹 Agar token invalid hai ya expire ho gaya
    return res.status(401).json({ message: "Invalid token" });
  }
};

