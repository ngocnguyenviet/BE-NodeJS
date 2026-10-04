const POSTGRES_INTEGER_MAX = 2 ** 31 - 1;

export function validateProductId(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0 || id > POSTGRES_INTEGER_MAX) {
        return res.status(400).json({ error: "ID phải là số nguyên dương thuộc khoảng 1 đến " + POSTGRES_INTEGER_MAX });
    }
    res.locals.productId = id;
    next();
}