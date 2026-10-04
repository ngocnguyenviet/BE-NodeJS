import { findProductById } from "../services/product.service.mjs";
import { listProducts, createProduct, updateProductPrice, deleteProductById } from "../services/product.service.mjs";
const POSTGRES_INTEGER_MAX = 2 ** 31 - 1;


export async function getProductById(req, res) {
    const id = res.locals.productId;

    const product = await findProductById(id);

    if (product === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json(product);
}


export async function getProductPrice(req, res) {
    const id = res.locals.productId;

    const product = await findProductById(id);

    if (product === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({ id: product.id, price: product.price });
}


export async function getProducts(req, res) {
    let minPrice, maxPrice, page = 1, limit = 10;

    const pageText = req.query.page;
    if (pageText !== undefined) {
        if (typeof pageText !== "string" || pageText.trim() === "") {
            return res.status(400).json({ error: "page phải là số nguyên dương" });
        }
        page = Number(pageText);
        if (!Number.isSafeInteger(page) || page < 1) {
            return res.status(400).json({ error: "page phải là số nguyên dương" });
        }
    }

    const limitText = req.query.limit;
    if (limitText !== undefined) {
        if (typeof limitText !== "string" || limitText.trim() === "") {
            return res.status(400).json({ error: "limit phải là số nguyên dương" });
        }
        limit = Number(limitText);
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({ error: "limit phải là số nguyên dương thuộc từ 1 đến 100" });
        }
    }

    const maxPriceText = req.query.maxPrice;
    if (maxPriceText !== undefined) {
        if (typeof maxPriceText !== "string" || maxPriceText.trim() === "") {
            return res.status(400).json({ error: "maxPrice phải là số không âm" });
        }

        maxPrice = Number(maxPriceText);
        if (!Number.isFinite(maxPrice) || maxPrice < 0) {
            return res.status(400).json({ error: "maxPrice phải là số không âm" });
        }
    }

    const minPriceText = req.query.minPrice;
    if (minPriceText !== undefined) {
        if (typeof minPriceText !== "string" || minPriceText.trim() === "") {
            return res.status(400).json({ error: "minPrice phải là số không âm" });
        }

        minPrice = Number(minPriceText);
        if (!Number.isFinite(minPrice) || minPrice < 0) {
            return res.status(400).json({ error: "minPrice phải là số không âm" });
        }
    }

    if (minPrice > maxPrice) {
        return res.status(400).json({ error: "minPrice phải nhỏ hơn maxPrice" });
    }

    const offset = (page - 1) * limit;

    if (!Number.isSafeInteger(offset)) {
        return res.status(400).json({ error: "Giá trị phân trang quá lớn" });
    }
    const result = await listProducts({ minPrice, maxPrice, limit, offset });
    return res.status(200).json(result);
}

export async function createProductHandler(req, res) {
    const input = req.body;

    const validProduct =
        input !== null &&
        typeof input === "object" &&
        !Array.isArray(input) &&
        typeof input.name === "string" &&
        input.name.trim().length > 0 &&
        input.name.trim().length <= 50 &&
        typeof input.price === "number" &&
        Number.isInteger(input.price) &&
        input.price >= 0 &&
        input.price <= POSTGRES_INTEGER_MAX;

    if (!validProduct) {
        return res.status(400).json({ error: "Dữ liệu sản phẩm không hợp lệ" });
    }

    const newProduct = await createProduct(input.name.trim(), input.price);
    return res.status(201).json(newProduct);
}

export async function updateProductPriceHandler(req, res) {
    const id = res.locals.productId;
    const input = req.body;

    const validInput =
        input !== null &&
        typeof input === "object" &&
        !Array.isArray(input) &&
        typeof input.price === "number" &&
        Number.isInteger(input.price) &&
        input.price >= 0 &&
        input.price <= POSTGRES_INTEGER_MAX;

    if (!validInput) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }

    const result = await updateProductPrice(id, input.price);
    if (result === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    return res.status(200).json(result);
}

export async function deleteProductHandler(req, res) {
    const id = res.locals.productId;

    const result = await deleteProductById(id);
    if (result === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    return res.status(200).json(result);
}
