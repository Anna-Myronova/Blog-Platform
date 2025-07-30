import { Request, Response } from "express";
import * as CommentsModel from "../models/commentsModel";
import { z } from "zod";

export const createCommentSchema = z.object({
  articleId: z.number().positive("Article ID must be greater than 0"),
  content: z.string().trim().min(1, "Content is required"),
});

export const commentIdParamSchema = z.object({
  id: z.coerce.number().positive("ID must be greater than 0"),
});

export const createComment = async (req: Request, res: Response) => {
  try {
    const parseResult = createCommentSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => e.message).join(", ");
      res.status(400).json({ message: `Validation failed: ${errors}` });
      return;
    }

    const { articleId, content } = parseResult.data;

    const newComment = await CommentsModel.createComment(
      articleId,
      req.user?.id!,
      content
    );

    res
      .status(201)
      .json({ message: "Comment created successfully", newComment });
  } catch (err) {
    console.error("Error creating comment in createComment controller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user?.id!;

    if (isNaN(commentId)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const deletedComment = await CommentsModel.deleteCommentById(
      userId,
      commentId
    );

    if (!deletedComment) {
      res.status(404).json({ message: "Comment is not found" });
      return;
    }

    res.status(200).json({ message: "Comment is deleted" });
  } catch (err) {
    console.error(
      "Error deleting comment in deleteCommentById controller:",
      err
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentsByArticleId = async (req: Request, res: Response) => {
  try {
    const articleId = Number(req.params.id);

    if (isNaN(articleId)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    if (isNaN(limit) || isNaN(offset)) {
      res.status(400).json({ error: "Limit and offset must be numbers" });
      return;
    }

    const comments = await CommentsModel.getCommentsByArticleId(
      articleId,
      limit,
      offset
    );

    const total = (await CommentsModel.countTotalCommentsByArticleId(articleId))
      .rows;

    res.status(200).json({
      total: total,
      comments,
    });
  } catch (err) {
    console.error(
      "Error finding comments in getCommentsByArticleId controller:",
      err
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCommentById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id!;
    const commentId = Number(req.params.id);
    const { newContent } = req.body;
    const commentAuthorId = await CommentsModel.checkIfUserIsAuthorComment(
      commentId
    );

    if (userId !== commentAuthorId) {
      res.status(400).json({ error: "You are not the author of the commment" });
      return;
    }


    if (isNaN(commentId)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    if (!newContent || newContent.trim() === "") {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    const updatedComment = await CommentsModel.updateCommentById(
      newContent,
      commentId,
      userId
    );

    if (!updatedComment) {
      res.status(404).json({ message: "Comment is not found" });
      return;
    }

    res.status(200).json({ message: "Comment is updated", updatedComment });
  } catch (err) {
    console.error(
      "Error updating comment in updateCommentById controller:",
      err
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
