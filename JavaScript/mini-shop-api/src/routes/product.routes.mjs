import express from "express";
import { getProductById, getProductPrice, getProducts, createProductHandler, updateProductPriceHandler, deleteProductHandler } from "../controllers/product.controller.mjs";
import { validateProductId } from "../middlewares/product-id.middleware.mjs";

const router = express.Router();

router.get("/:id", validateProductId, getProductById);
router.get("/:id/price", validateProductId, getProductPrice);
router.get("/", getProducts);
router.post("/", createProductHandler);
router.patch("/:id/price", validateProductId, updateProductPriceHandler);
router.delete("/:id", validateProductId, deleteProductHandler);

export default router;

