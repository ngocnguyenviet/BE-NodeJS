const ordersJSON = `[
    {
        "id":1,
        "items":[
            {
                "productId": 1,
                "quantity": 2
            },
            {
                "productId": 2,
                "quantity": 1
            }
        ]
    },
    {
        "id": 2,
        "items":[
            {
                "productId": 3,
                "quantity": 3
            }
        ]
    }
]`;

const productsJSON = `
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

const ordersJS = JSON.parse(ordersJSON);
const productsJS = JSON.parse(productsJSON);

function calculateOrderTotal(orderId) {
    const order = ordersJS.find((item) => item.id === orderId);
    if (order) {
        let total = 0;
        for (const item of order.items) {
            const product = productsJS.find((p) => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        return total;
    } else {
        return "Khong tim thay don hang";
    }
}

console.log(calculateOrderTotal(1));
console.log(calculateOrderTotal(2));
console.log(calculateOrderTotal(3));