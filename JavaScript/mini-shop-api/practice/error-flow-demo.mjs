import express from "express";
import { handleError } from "../src/middlewares/error-handler.middleware.mjs";
import { AppError } from "../src/errors/app-error.mjs";


const app = express();

async function mockFindProduct(mode) {
    if (mode === "ok") return {
        id: 1,
        name: "PC",
        price: 30000000,
    };
    else if (mode === "missing") return undefined;
    else if (mode === "error") {
        throw new Error("Lỗi mô phỏng");
    }
    else if (mode === "conflict") {
        throw new AppError(
            409,
            "DEMO_CONFLICT",
            "Thao tác xung đột với trạng thái hiện tại"
        );
    }
}

app.get("/demo/:mode", async (req, res) => {
    const product = await mockFindProduct(req.params.mode);

    if (product === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    return res.status(200).json(product);
});

app.use(handleError);

app.listen(3001, () => {
    console.log("Mini Shop API đang chạy tại http://localhost:3001");
});