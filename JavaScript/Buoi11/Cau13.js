const productsJSON = `
    [
        {
            "id": 1,
            "name": "iPhone 12",
            "quantity": 10
        },
        {
            "id": 2,
            "name": "Samsung",
            "quantity": 5
        },
        {
            "id": 3,
            "name": "Google",
            "quantity": 8
        }
    ]
`;

let productsJS = JSON.parse(productsJSON);

function calculateTotalQuantity() {
    const totalQuantity = productsJS.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
    return totalQuantity;
}

console.log(calculateTotalQuantity());