import { findProductById } from "../services/product.service.mjs";
import { listProducts, createProduct } from "../services/product.service.mjs";
const POSTGRES_INTEGER_MAX = 2 ** 31 - 1;


export async function getProductById(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID phải là số nguyên dương" });
    }

    const product = await findProductById(id);

    if (product === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json(product);
}


export async function getProductPrice(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID phải là số nguyên dương" });
    }
    const product = await findProductById(id);

    if (product === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({ id: product.id, price: product.price });
}


export async function getProducts(req, res) {
    let result = await listProducts();

    const maxPriceText = req.query.maxPrice;
    if (maxPriceText !== undefined) {
        if (typeof maxPriceText !== "string" || maxPriceText.trim() === "") {
            return res.status(400).json({ error: "maxPrice phải là số không âm" });
        }

        const maxPrice = Number(maxPriceText);
        if (!Number.isFinite(maxPrice) || maxPrice < 0) {
            return res.status(400).json({ error: "maxPrice phải là số không âm" });
        }

        result = result.filter((product) => product.price <= maxPrice);
    }

    const minPriceText = req.query.minPrice;
    if (minPriceText !== undefined) {
        if (typeof minPriceText !== "string" || minPriceText.trim() === "") {
            return res.status(400).json({ error: "minPrice phải là số không âm" });
        }

        const minPrice = Number(minPriceText);
        if (!Number.isFinite(minPrice) || minPrice < 0) {
            return res.status(400).json({ error: "minPrice phải là số không âm" });
        }

        result = result.filter((product) => product.price >= minPrice);
    }

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
