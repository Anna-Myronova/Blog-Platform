import { Router } from "express";
import { getAllTags} from "../controllers/tagsController";
const router = Router();

router.get("/tags", getAllTags);

export default router;