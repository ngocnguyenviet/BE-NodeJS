const products = [
    { id: 1, name: "laptop", price: 20000000, stock: 5 },
    { id: 2, name: "Mouse", price: 300000, stock: 20 },
    { id: 3, name: "Keyboard", price: 700000, stock: 30 },
];

export function getAffordableProducts(maxPrice) {
    return products.filter((product) => product.price <= maxPrice);
}

export function getProductById(id) {
    return products.find((product) => product.id === id);
}

export function getProductByName(name) {
    return products.find((product) => product.name === name);
}

export function getProductSummaries() {
    return products.map((product) => ({
        name: product.name,
        price: product.price,
    }));
}

export function createProduct(name, price) {
    if (price < 0) {
        throw new Error("Giá sản phẩm không được âm");
    }
    if (name === "") {
        throw new Error("Tên sản phẩm không được rỗng");
    }

    return { name, price };
}