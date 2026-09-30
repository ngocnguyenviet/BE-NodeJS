import express from "express";
import { getProductById, getProductPrice, getProducts, createProductHandler } from "../controllers/product.controller.mjs";

const router = express.Router();

router.get("/:id", getProductById);
router.get("/:id/price", getProductPrice);
router.get("/", getProducts);
router.post("/", createProductHandler);


export default router;

