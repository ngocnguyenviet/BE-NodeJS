import app from "./app.mjs";

const portText = process.env.PORT ?? "3000";
const port = Number(portText);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT phải là số nguyên từ 1 đến 65535");
}

app.listen(port, () => {
    console.log(`Mini Shop API đang chạy tại http://localhost:${port}`);
});