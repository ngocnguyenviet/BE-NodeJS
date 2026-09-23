import express from "express";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use("/users", userRouter);

app.listen(3000, () => {
    console.log("Server đang chạy ở cổng 3000");
});