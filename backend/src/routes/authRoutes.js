import { Router } from "express";
import { login, profile, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authLoginSchema, authRegisterSchema } from "../validators/schemas.js";

const router = Router();
router.post("/register", validate(authRegisterSchema), register);
router.post("/login", validate(authLoginSchema), login);
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);
export default router;
