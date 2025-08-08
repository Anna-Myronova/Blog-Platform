import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/typeJWTPayload";
import * as UserModel from "../models/userModel";
import { generateAccessToken } from "../utils/jwt";

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token required" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JWTPayload;

    const user = await UserModel.getUserByRefreshToken(refreshToken);
    if (!user) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
