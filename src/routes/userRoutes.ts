import { Router } from "express";
import {
  getUserById,
  getMe,
  deleteUserById,
  updateUser,
  chooseInterests,
  getFeed
} from "../controllers/userController";
import { authMiddleware } from "../middlewareAuth";
const router = Router();

router.get("/me", getMe);
router.delete("/user/:id", authMiddleware, deleteUserById);
router.patch("/user/:id", authMiddleware, updateUser);
router.post("/interests", authMiddleware, chooseInterests);
router.get("/feed", authMiddleware, getFeed);


export default router;