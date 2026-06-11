import { Router } from "express";
import { dashboardSummary } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/summary", protect, dashboardSummary);
export default router;
