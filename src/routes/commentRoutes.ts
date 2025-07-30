import { Router } from "express";
import { createComment, deleteCommentById, updateCommentById, getCommentsByArticleId } from "../controllers/commentController";
import { authMiddleware } from "../middlewareAuth";
const router = Router();

router.post("/", authMiddleware, createComment);
router.delete("/:id", authMiddleware, deleteCommentById);
router.patch("/:id", authMiddleware, updateCommentById);
router.get("/:id", getCommentsByArticleId);

export default router;