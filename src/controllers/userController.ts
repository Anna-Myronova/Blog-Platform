import { Request, Response } from "express";
import * as UserModel from "../models/userModel";
import {
  getUserInterestsCount,
  setStartPriority,
} from "../models/userInterestsModel";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const user = await UserModel.getUserById(id);

    if (!user) {
      res.status(404).json({ message: "User is not found" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getUserById controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const deletedUser = await UserModel.deleteUserById(id);

    if (!deletedUser) {
      res.status(404).json({ message: "User is not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    console.error("Error in deleteUserById controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { email, username } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }
    if (!username || !email) {
      res.status(400).json({ message: "Username and email are required" });
      return;
    }
    const updatedUser = await UserModel.updateUser(id, username, email);

    if (!updatedUser) {
      res.status(404).json({ message: "User is not found" });
      return;
    }
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    console.error("Error in updateUser controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id!;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hasSelectedInterests = await getUserInterestsCount(userId);
    res.status(200).json({
      id: userId,
      hasSelectedInterests: hasSelectedInterests,
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const chooseInterests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id!;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { interests } = req.body;

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      res.status(400).json({ message: "No interests selected" });
      return;
    }

    const result = await setStartPriority(interests, userId);

    res.status(201).json({ message: "Interests set", interests: result });
  } catch (err) {
    console.error("Error in chooseInterests controller:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
