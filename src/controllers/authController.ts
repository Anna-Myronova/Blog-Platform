import { z, ZodIssue } from "zod";
import { error } from "console";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/userModel";
import { JWTPayload } from "../types/typeJWTPayload";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export const register = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join(", ");
      res.status(400).json({ message: `Validation failed: ${errors}` });
      return;
    }

    const { username, email, password } = req.body;

    const existingUser = await UserModel.getUserByEmail(email);

    if (existingUser) {
      res
        .status(400)
        .json({ message: "User with such email is already exist" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await UserModel.createUser(username, email, hashedPassword);
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username } as JWTPayload,
      process.env.JWT_SECRET!
    );

    res.status(201).json({ newUser, token });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join(", ");
      res.status(400).json({ message: `Validation failed: ${errors}` });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
       res
        .status(400)
        .json({ message: "Email and password are required" });
        return;
    }

    const existingUser = await UserModel.getUserByEmail(email);

    if (!existingUser) {
      res.status(401).json({ message: "Email or password is not correct" });
      return;
    }

    if (!(await bcrypt.compare(password, existingUser.password))) {
      res.status(401).json({ message: "Email or password is not correct" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email, username: existingUser.username } as JWTPayload,
      jwtSecret,
      { expiresIn: "15m" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};