import { Router } from "express";
import { backupReport, dailyReport, monthlyReport, yearlyReport } from "../controllers/reportsController.js";
import { protect, resolveShop } from "../middleware/auth.js";

const router = Router();
router.use(protect, resolveShop);
router.get("/daily", dailyReport);
router.get("/monthly", monthlyReport);
router.get("/yearly", yearlyReport);
router.get("/backup", backupReport);
export default router;
