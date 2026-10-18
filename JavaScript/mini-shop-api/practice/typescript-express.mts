import express from "express";
import type { Request, Response, NextFunction } from "express";

import { parseCreateProductInput } from "./typescript-parse.mts";
import type { CreateProductInput } from "./typescript-parse.mts";

import { AppError } from "../src/errors/app-error.mjs";
import { handleError } from "../src/middlewares/error-handler.middleware.mjs";
import { parse } from "path";

import { buildProductsPreview } from "./typescript-product.service.mts";
import type { ProductPreview } from "./typescript-product.service.mts";

//Lần lượt: kiểu params, kiểu response body, kiểu request body.
type ProductRequest = Request<
    Record<string, string>,
    unknown,
    unknown
>;

//Dữ liệu middleware chuyển cho controller.
type ProductLocals = {
    productInput?: CreateProductInput;
};

type ProductResponse = Response<unknown, ProductLocals>;

//middleware validation
function validateCreateProduct(
    req: ProductRequest,
    res: ProductResponse,
    next: NextFunction
): void {
    try {
        res.locals.productInput = parseCreateProductInput(req.body);
    } catch (error) {
        next(error);
        return;
    }

    next();
}

//Controller preview
function previewCreateProduct(
    _req: ProductRequest, // _ quy ước báo rằng "hàm này hiện không sử dụng tham số request"
    res: ProductResponse,
    next: NextFunction
) {
    const input = res.locals.productInput;

    if (input === undefined) {
        return next(
            new AppError(
                500,
                "PRODUCT_INPUT_MISSING",
                "Thiếu dữ liệu đã được kiểm tra"
            )
        );
    }

    return res.status(200).json(input);
}

const app = express();

app.use(express.json({ limit: "10kb" }));

app.post(
    "/preview/products",
    validateCreateProduct,
    previewCreateProduct
);

app.use(handleError);

app.listen(3001, () => {
    console.log("Preview API chạy tại http://localhost:3001");
});