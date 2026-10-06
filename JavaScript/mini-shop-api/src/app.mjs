import express from "express";
import healthRouter from "./routes/health.routes.mjs";
import productRouter from "./routes/product.routes.mjs";
import { handleError } from "./middlewares/error-handler.middleware.mjs";

const app = express();


//Chạy trước các route để ghi lại mọi request, rổi chuyển tiếp bằng next()
app.use((req, res, next) => {
    console.log("Request:", req.method, req.path);
    next();
});


//Phân tích body JSON; request JSON sai cú pháp hoặc vượt quá limit sẽ đi tới
// middleware xử lý lỗi
app.use(express.json({ limit: "10kb" }));

//Phân loại route xử lý
app.use("/health", healthRouter);
app.use("/products", productRouter);

//Đặt sau tất cả routes; request chưa được xử lý sẽ nhận 404
app.use((req, res) => {
    return res.status(404).json({
        path: req.path,
        error: "Route không tồn tại"
    });
});


//Middleware bốn tham số nhận lỗi từ các bước phía trước, không chỉ mỗi body;
app.use(handleError);


export default app;
