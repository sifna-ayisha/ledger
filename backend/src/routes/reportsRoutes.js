import { Router } from "express";
import { backupReport, dailyReport, monthlyReport, yearlyReport } from "../controllers/reportsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/daily", dailyReport);
router.get("/monthly", monthlyReport);
router.get("/yearly", yearlyReport);
router.get("/backup", backupReport);
export default router;
