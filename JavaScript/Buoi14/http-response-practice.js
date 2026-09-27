async function loadProduct() {
    const response = await fetch("http://localhost:3000/products/2");

    console.log(response.status);

    if (!response.ok) {
        throw new Error(`Request thất bại: ${response.status}`);
    }

    const product = await response.json();
    console.log(product);
}