import express from "express";

const app = express();

const products = [
    { id: 1, name: "Laptop", price: 20000000 },
    { id: 2, name: "Mouse", price: 300000 },
];

app.use((req, res, next) => {
    console.log("Request:", req.method, req.path);
    next();
});

app.get("/products", (req, res) => {
    let result = products;

    const maxPriceText = req.query.maxPrice;
    if (maxPriceText !== undefined) {
        if (typeof maxPriceText !== "string" || maxPriceText.trim() === "") {
            return res.status(400).json({ error: "maxPrice phải là số không âm" });
        }

        const maxPrice = Number(maxPriceText);
        if (!Number.isFinite(maxPrice) || maxPrice < 0) {
            return res.status(400).json({ error: "maxPrice phải là số không âm" });
        }

        result = result.filter((product) => product.price <= maxPrice);
    }

    const minPriceText = req.query.minPrice;
    if (minPriceText !== undefined) {
        if (typeof minPriceText !== "string" || minPriceText.trim() === "") {
            return res.status(400).json({ error: "minPrice phải là số không âm" });
        }

        const minPrice = Number(minPriceText);
        if (!Number.isFinite(minPrice) || minPrice < 0) {
            return res.status(400).json({ error: "minPrice phải là số không âm" });
        }

        result = result.filter((product) => product.price >= minPrice);
    }

    return res.status(200).json(result);
});


app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID phải là số nguyên dương" });
    }

    const product = products.find((item) => item.id === id);

    if (product === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json(product);
});

app.get("/products/:id/price", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID phải là số nguyên dương" });
    }

    const product = products.find((item) => item.id === id);

    if (product === undefined) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({ id: product.id, price: product.price });
});


app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use(express.json({ limit: "10kb" }));


app.post("/products", (req, res) => {
    const input = req.body;

    const validProduct =
        input !== null &&
        typeof input === "object" &&
        !Array.isArray(input) &&
        typeof input.name === "string" &&
        input.name.trim().length > 0 &&
        input.name.trim().length <= 50 &&
        typeof input.price === "number" &&
        Number.isFinite(input.price) &&
        input.price >= 0;

    if (!validProduct) {
        return res.status(400).json({ error: "Dữ liệu sản phẩm không hợp lệ" });
    }

    const newProduct = {
        id: products.length + 1,
        name: input.name.trim(),
        price: input.price,
    };

    products.push(newProduct);
    return res.status(201).json(newProduct);
});


app.listen(3000, () => {
    console.log("Mini Shop API đang chạy tại http://localhost:3000");
});
