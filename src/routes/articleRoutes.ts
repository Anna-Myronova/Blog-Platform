import { Router } from "express";
import {
  createArticle,
  deleteArticleById,
  getArticlesByUserId
} from "../controllers/articleController";
import { authMiddleware } from "../middlewareAuth";
const router = Router();

router.post("/", authMiddleware, createArticle);
router.delete("/", authMiddleware, deleteArticleById);
router.get("/", getArticlesByUserId);
