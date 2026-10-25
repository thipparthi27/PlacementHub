
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  branch: u.branch,
  cgpa: u.cgpa,
  backlogs: u.backlogs,
  skills: u.skills,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const exists = await User.findOne({
      email: email.toLowerCase()
    });

    if (exists) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    res.status(201).json({
      token: signToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    const match =
      user && (await bcrypt.compare(password, user.passwordHash));

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      token: signToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: publicUser(req.user)
  });
};