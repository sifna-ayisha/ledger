import { Router } from "express";
import { adminLogin, login, profile, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { adminLoginSchema, authLoginSchema, authRegisterSchema } from "../validators/schemas.js";

const router = Router();
router.post("/register", validate(authRegisterSchema), register);
router.post("/login", validate(authLoginSchema), login);
router.post("/admin-login", validate(adminLoginSchema), adminLogin);
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);
export default router;
