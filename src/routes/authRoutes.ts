import { Router } from "express";
import { login, register } from "../controllers/authController";
import { refresh } from "../controllers/refreshController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;