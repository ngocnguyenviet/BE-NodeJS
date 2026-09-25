let productsJSON = `
    [
        {
            "id": 1,
            "name": "iPhone 12",
            "price": 1200
        },
        {
            "id": 2,
            "name": "Samsung",
            "price": 1000
        },
        {
            "id": 3,
            "name": "Google",
            "price": 1500
        }
    ]
`;

let productsJS = JSON.parse(productsJSON);

function deleteProduct(productId) {
    productsJS = productsJS.filter(item => item.id !== productId);
    productsJSON = JSON.stringify(productsJS, null, 2);
}

deleteProduct(2);
console.log(productsJSON);
