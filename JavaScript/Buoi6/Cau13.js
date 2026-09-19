const products = [
    { name: "Điện thoại", price: 500 },
    { name: "Máy tính", price: 50 },
    { name: "Laptop", price: 1200 },
    { name: "Chuột", price: 25 }
];

const expensiveProducts = products.filter(function (item) {
    return item.price > 100;
});

const expensiveProducts2 = products.filter((item) => item.price > 100);

console.log(expensiveProducts);
console.log(expensiveProducts2);