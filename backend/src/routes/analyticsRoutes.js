import { Router } from "express";
import { analytics } from "../controllers/analyticsController.js";
import { protect, resolveShop } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, resolveShop, analytics);
export default router;
