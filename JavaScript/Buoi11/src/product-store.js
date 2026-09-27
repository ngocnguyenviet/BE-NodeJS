export function createProductStore() {
    const products = [];
    return {
        add(product) {
            products.push(product);
            return product;
        },

        getAll() {
            return products;
        },
    };
}