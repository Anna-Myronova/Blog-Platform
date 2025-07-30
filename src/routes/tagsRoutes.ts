import { Router } from "express";
import { getAllTags} from "../controllers/tagsController";
const router = Router();

router.get("/", getAllTags);

export default router;