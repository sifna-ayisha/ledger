import { Router } from "express";
import { backupLedgerEntries, createLedgerEntry, deleteLedgerEntry, groupedLedgerEntries, listLedgerEntries, restoreLedgerEntries, updateLedgerEntry } from "../controllers/ledgerController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { ledgerEntrySchema } from "../validators/schemas.js";

const router = Router();
router.use(protect);
router.route("/").get(listLedgerEntries).post(validate(ledgerEntrySchema), createLedgerEntry);
router.get("/grouped", groupedLedgerEntries);
router.get("/backup", backupLedgerEntries);
router.post("/restore", restoreLedgerEntries);
router.route("/:id").put(updateLedgerEntry).delete(deleteLedgerEntry);
export default router;
