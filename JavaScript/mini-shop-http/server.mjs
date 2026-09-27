import { createServer } from "node:http";

const products = [
    { id: 1, name: "Laptop", price: 20000000 },
    { id: 2, name: "Mouse", price: 300000 },
];

const server = createServer(async (req, res) => {
    console.log(req.method, req.url);
    const requestUrl = new URL(req.url, "http://localhost:3000");

    if (req.method === "GET" && requestUrl.pathname === "/products") {
        const maxPriceTest = requestUrl.searchParams.get("maxPrice");
        let result = products;

        if (maxPriceTest !== null) {
            const maxPrice = Number(maxPriceTest);

            if (maxPriceTest.trim() === "" || !Number.isFinite(maxPrice) || maxPrice < 0) {
                res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
                res.end("maxPrice phải là số không âm");
                return;
            }

            result = products.filter((product) => product.price <= maxPrice);
        }

        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(result));
        return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/health") {
        res.writeHead(200, {
            "content-type": "text/plain; charset=utf-8",
        });
        res.end("OK");
        return;
    }

    const segments = requestUrl.pathname.split("/");

    if (
        req.method === "GET" &&
        segments.length === 3 &&
        segments[1] === "products" &&
        segments[2] !== ""
    ) {
        const id = Number(segments[2]);

        if (!Number.isInteger(id) || id <= 0) {
            res.writeHead(400, { "content-type": "application/json; charset=utf-8", });
            res.end(JSON.stringify({ error: "ID phải là số nguyên dương" }));
            return;
        }

        const product = products.find((item) => item.id === id);

        if (product === undefined) {
            res.writeHead(404, { "content-type": "application/json; charset=utf-8", });
            res.end(JSON.stringify({ error: "Không tìm thấy sản phẩm" }));
            return
        }
        res.writeHead(200, { "content-type": "application/json; charset=utf-8", });
        res.end(JSON.stringify(product));
        return;
    }


    if (req.method === "POST" && requestUrl.pathname === "/products") {
        req.setEncoding("utf-8");
        let rawBody = "";

        for await (const chunk of req) {
            rawBody += chunk;
        }

        let input;

        try {
            input = JSON.parse(rawBody);
        } catch {
            res.writeHead(400, { "content-type": "application/json; charset=utf-8", });
            res.end(JSON.stringify({ error: "Body phải là JSON hợp lệ" }));
            return;
        }

        const validProduct =
            input !== null &&
            typeof input === "object" &&
            !Array.isArray(input) &&
            typeof input.name === "string" &&
            input.name.trim() !== "" &&
            input.name.trim().length <= 50 &&
            typeof input.price === "number" &&
            Number.isFinite(input.price) &&
            input.price >= 0;

        if (!validProduct) {
            res.writeHead(400, { "content-type": "application/json; charset=utf-8", });
            res.end(JSON.stringify({ error: "Dữ liệu sản phẩm không hợp lệ" }));
            return;
        }

        const newProduct = {
            id: products.length + 1,
            name: input.name.trim(),
            price: input.price,
        };

        products.push(newProduct);

        res.writeHead(201, { "content-type": "application/json; charset=utf-8", });
        res.end(JSON.stringify(newProduct));
        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
    });

    res.end("Not found");
});

server.listen(3000, () => {
    console.log("Server đang chạy tại http://localhost:3000");
});