import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const signup: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        firstLogin: newUser.firstLogin,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err });
  }
};

export const updateFirstLogin: RequestHandler = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { firstLogin: false },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "First login updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update firstLogin", error: err });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        firstLogin: user.firstLogin,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};
