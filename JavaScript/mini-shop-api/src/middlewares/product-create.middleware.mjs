const POSTGRES_INTEGER_MAX = 2 ** 31 - 1;
export function validateCreateProduct(req, res, next) {
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
    next();
}