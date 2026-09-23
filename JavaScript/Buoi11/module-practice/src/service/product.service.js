const products = [];

export function createProduct(name, price) {
    const newProduct = {
        id: products.length + 1,
        name,
        price
    };

    products.push(newProduct);
    return { ...newProduct };
}

export function getProducts() {
    return products.map((product) => ({ ...product }));
}
