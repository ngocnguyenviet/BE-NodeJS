import { AppError } from "../errors/app-error.mjs";


export function handleError(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            code: "INVALID_JSON",
            error: "Body phải là JSON hợp lệ",
        });
    }

    if (err.type === "entity.too.large") {
        return res.status(413).json({ error: "Body vượt quá giới hạn 10kb" });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            code: err.code,
            error: err.message,
        });
    }

    console.error(err);
    return res.status(500).json({ error: "Lỗi server" });
}