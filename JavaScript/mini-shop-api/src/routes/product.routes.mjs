import express from "express";
import { getProductById, getProductPrice, getProducts, createProductHandler, updateProductPriceHandler, deleteProductHandler } from "../controllers/product.controller.mjs";
import { validateProductId } from "../middlewares/product-id.middleware.mjs";
import { validateProductPrice } from "../middlewares/product-price.middleware.mjs";
import { validateCreateProduct } from "../middlewares/product-create.middleware.mjs";
const router = express.Router();

router.get("/:id", validateProductId, getProductById);
router.get("/:id/price", validateProductId, getProductPrice);
router.get("/", getProducts);
router.post("/", validateCreateProduct, createProductHandler);
router.patch("/:id/price", validateProductId, validateProductPrice, updateProductPriceHandler);
router.delete("/:id", validateProductId, deleteProductHandler);

export default router;

