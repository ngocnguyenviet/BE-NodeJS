import { rejects } from "node:assert";
import { resolve } from "node:dns";

const product = {
    id: 1,
    name: "laptop"
};

function findProductById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new Error("Id không hợp lệ"));
                return;
            }

            if (id !== product.id) {
                resolve(null);
                return;
            }

            resolve(product);
        }, 300);
    });
}

export { findProductById }
