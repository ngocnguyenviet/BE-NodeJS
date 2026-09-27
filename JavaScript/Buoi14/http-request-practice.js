// await fetch("https://localhost:3000/products", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ name: "Mouse", price: 300000 }),
// });

await fetch("https://localhost:3000/products", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Keyboard", price: "700000" }),
});