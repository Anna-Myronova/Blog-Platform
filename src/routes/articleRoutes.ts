import { Router } from "express";
import {
  createArticle,
  deleteArticleById,
  getArticlesByUserId, 
  likeArticle,
  unlikeArticle
} from "../controllers/articleController";
import { authMiddleware } from "../middlewareAuth";
const router = Router();

router.post("/", authMiddleware, createArticle);
router.delete("/:id", authMiddleware, deleteArticleById);
router.get("/:id", getArticlesByUserId);
router.post("/:id/like", authMiddleware, likeArticle);
router.delete("/:id/unlike", authMiddleware, unlikeArticle);

export default router;