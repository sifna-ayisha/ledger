import { Router } from "express";
import { dashboardSummary } from "../controllers/dashboardController.js";
import { protect, resolveShop } from "../middleware/auth.js";

const router = Router();
router.get("/summary", protect, resolveShop, dashboardSummary);
export default router;
