import { findProductById } from "./product.service.js";

findProductById(1).then((foundProduct) => {
    console.log("Kết quả:", foundProduct);
})
    .catch((error) => {
        console.log("Lỗi:", error);
    });