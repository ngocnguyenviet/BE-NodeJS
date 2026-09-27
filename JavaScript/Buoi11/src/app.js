import express from "express";
import userRouter from "./routes/user.route.js";
import { createProductStore } from "./product-store.js";
import { getAffordableProducts, getProductById } from "./services/product.service.js";
import { calculateOrderTotal } from "./services/order.service.js";
import { createProduct } from "./services/product.service.js";






const app = express();
const productStore = createProductStore();
productStore.add({ name: "laptop", price: 20000000 });
// console.log(productStore.getAll());

app.use(express.json());
app.use("/users", userRouter);

app.listen(3000, () => {
    console.log("Server đang chạy ở cổng 3000");
});

// console.log(getProductById(2));
// console.log(getProductById(99));

// console.log(getAffordableProducts(700000));

// const items = [
//     { price: 300000, quantity: 2 },
//     { price: 100000, quantity: 1 },
// ];

// console.log(calculateOrderTotal(items));

try {
    const product = createProduct("Mouse", -100);
    console.log("Đã tạo: ", product);
} catch (error) {
    console.log("Không tạo được sản phẩm: ", error.message);
}
