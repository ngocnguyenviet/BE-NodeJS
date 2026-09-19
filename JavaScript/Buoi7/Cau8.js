const sum = (array) => {
    return array.reduce((total, num) => total + num, 0);
};

const getTotalPrice = (array) => {
    const arrayTotal = array.map((item) => item.quantity * item.price);
    return sum(arrayTotal);
};

const test1 = getTotalPrice([
    { product: "Sua", quantity: 2, price: 7000 },
    { product: "Ngu Coc", quantity: 2, price: 50000 },
]);
console.log(test1);

