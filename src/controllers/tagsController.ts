import { Request, Response } from "express";
import * as TagModel from "../models/tagsModel";

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await TagModel.getAllTags();
    res.status(200).json({ tags });
  } catch (err) {
    console.error("Error fetching tags in getAllTags controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
