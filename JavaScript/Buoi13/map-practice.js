// const prices = [100, 200, 300];

import { get } from "node:http";

// const pricesWithFee = prices.map((price) => price + 10);


const products = [
    { id: 1, name: "laptop", price: 20000000, stock: 5 },
    { id: 2, name: "Mouse", price: 300000, stock: 20 },
    { id: 3, name: "Keyboard", price: 700000, stock: 30 },
];

// console.log(pricesWithFee);
// console.log(prices);

function getProductNames() {
    return products.map((product) => product.name);
}

console.log(getProductNames());