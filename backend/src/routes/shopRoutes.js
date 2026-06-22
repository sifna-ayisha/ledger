import { Router } from "express";
import { addShopUser, createShop, getShopDetails, listAllShops, listShopUsers, listShops, updateShop } from "../controllers/shopController.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { shopSchema, shopUserSchema } from "../validators/schemas.js";

const router = Router();

router.use(protect);
router.get("/admin/all", adminOnly, listAllShops);
router.get("/admin/:id", adminOnly, getShopDetails);
router.route("/").get(listShops).post(validate(shopSchema), createShop);
router.route("/:id/users").get(listShopUsers).post(validate(shopUserSchema), addShopUser);
router.route("/:id").put(validate(shopSchema), updateShop);

export default router;
