import {
    createProduct,
    getProducts
} from "./service/product.service.js";

createProduct("laptop", 20000000);
createProduct("mouse", 300000);
console.log("Danh sách sản phẩm:", getProducts());
