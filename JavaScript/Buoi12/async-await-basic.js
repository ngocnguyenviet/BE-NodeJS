// async function getNumber() {
//     return 5;
// }

import { findProductById } from "./product.service.js";

// getNumber().then((number) => {
//     console.log(number);
// });

// async function showProduct() {
//     try {
//         const product = await findProductById(1);
//         console.log(product);
//     } catch (error) {
//         console.log("Có lỗi: ", error.message);
//     }
// }

async function loadProducts() {
    try {
        const response = await fetch("http://localhost:3001/products");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const products = await response.json();
        console.log("Danh sách sản phẩm: ", products);
    } catch (error) {
        console.log("Không đọc được sản phẩm: ", error.message);
    }
}

loadProducts();
console.log("Đã gửi yêu cầu đọc sản phẩm");