const totalPrice = (array) => {
    return array.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cart = [
    { name: "iPhone", price: 1000, quantity: 5 },
    { name: "iPad", price: 500, quantity: 2 },
    { name: "MacBook", price: 2000, quantity: 1 },
];

console.log(totalPrice(cart));