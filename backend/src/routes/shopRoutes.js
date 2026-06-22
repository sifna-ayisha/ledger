import { Router } from "express";
import { addShopUser, createShop, listShopUsers, listShops, updateShop } from "../controllers/shopController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { shopSchema, shopUserSchema } from "../validators/schemas.js";

const router = Router();

router.use(protect);
router.route("/").get(listShops).post(validate(shopSchema), createShop);
router.route("/:id/users").get(listShopUsers).post(validate(shopUserSchema), addShopUser);
router.route("/:id").put(validate(shopSchema), updateShop);

export default router;
