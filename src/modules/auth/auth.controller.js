import { User } from "../../../database/models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, gender ,userType } = req.body;
    // Basic validation
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    req.body.password = hashedPassword;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      userType,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, recaptcha } = req.body;

    // Basic validation for email, password and recaptcha token
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    
    if (!recaptcha) {
      return res.status(400).json({ message: "reCAPTCHA token is required" });
    }
    
    // 2. Verify token with Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", recaptcha);
    
    const googleRes = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    
    const googleData = await googleRes.json();
    
    // 3. Handle Google’s response
    if (!googleData.success || googleData.score < 0.5) {
      return res.status(400).json({ message: "reCAPTCHA validation failed" })}

    // Check if user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET, // Use a secret from your environment
      { expiresIn: "7d" }
    );

    // If login is successful, return the user information
    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        userType: user.userType,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export {
  signup,
  login
};
