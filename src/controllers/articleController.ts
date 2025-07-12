import { Request, Response } from "express";
import * as ArticleModel from "../models/articlesModel";
import { z } from "zod";
import { title } from "process";

export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
});

export const createArticle = async (req: Request, res: Response) => {
  try {
    const parseResult = createArticleSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => e.message).join(", ");
      res.status(400).json({ message: `Validation failed: ${errors}` });
      return;
    }

    const { title, content, tags } = parseResult.data;

    const newArticle = await ArticleModel.createArticle(
      req.user?.id!,
      title,
      content,
      tags
    );

    res
      .status(201)
      .json({ message: "Article created successfully", newArticle });
  } catch (err) {
    console.error("Error creating article in createArticle controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArticleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const deletedArticle = await ArticleModel.deleteArticleById(
      req.user?.id!,
      id
    );

    if (!deletedArticle) {
      res.status(404).json({ error: "Article is not found" });
      return;
    }
    res.status(200).json({ message: "Article is deleted" });
  } catch (err) {
    console.error(
      "Error deleting article in deleteArticleById controller:",
      err
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArticlesByUserId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const offset = req.query.offset ? Number(req.query.offset) : 0; 

    if (isNaN(limit) || isNaN(offset)) {
      res.status(400).json({ error: "Limit and offset must be numbers" });
      return;
    }

    const articles = await ArticleModel.getArticlesByUserId(id, limit, offset);

    if (articles.length === 0) {
      res.status(404).json({ message: "No articles found for this user" });
      return;
    }
    res.status(200).json({ message: `Found ${articles.length} articles:`, articles });
  } catch (err) {
    console.error(
      "Error finding articles in getArticlesByUserId controller:",
      err
    );
    res.status(500).json({ message: "Internal server error" });
  }
};