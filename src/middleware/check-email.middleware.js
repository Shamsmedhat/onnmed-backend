import { User } from '../../database/models/user.model.js';
import cors from "cors";
import express from "express"

const app = express();
app.use(cors({
  origin: ["https://onnmed.vercel.app", "http://localhost:3000"],
}));

export const checkEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    next();
  } catch (err) {
    console.error('Email check error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  next(); 
};
