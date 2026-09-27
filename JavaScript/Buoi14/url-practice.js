// const url = new URL("http://localhost:3000/products?maxPrice=700000");

// console.log(url.pathname);
// console.log(url.searchParams.get("maxPrice"));

const url = new URL("http://localhost:3000/products?page=3");

console.log(url.searchParams.get("page"));