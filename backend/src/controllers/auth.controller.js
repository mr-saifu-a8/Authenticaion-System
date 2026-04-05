import  bcrypt  from 'bcrypt';
import jwt from "jsonwebtoken"
import User from "../models/user.model"

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(200).json({ message: "User registered" });
  } catch (error) {
   return res.status(500).json({message: "Server error"})
  }
}


export const login = async (req, res) => {
 try {
   const { email, password } = req.body;

   if (!email || !password) {
     return res.status(400).json({ message: "All fields are required" });
   }

   if (!email.includes("@")) {
     return res.status(400).json({ message: "Invalid email" });
   }

   const user = await User.findOne({ email });

   if (!user) {
     return res.status(400).json({ message: "Invalid credentials" });
   }

   const isMatch = await bcrypt.compare("password", user.password);

   if (!isMatch) {
     return res.status(400).json({ message: "Invalid credentials" });
   }

   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
     expiresIn: "1d",
   });

   res.status(201).json({ message: "User loggedIn", token });
 } catch (error) {
  return res.status(500).json({message: "Server error"})
 }
}