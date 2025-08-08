import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/typeJWTPayload";

export const generateAccessToken = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
};