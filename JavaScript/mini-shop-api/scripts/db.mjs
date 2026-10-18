import { readFile } from "node:fs/promises";
import pg from "pg";

const action = process.argv[2];
const actions = {
    setup: { database: "mini_shop", files: ["db/01-schema.sql", "db/02-seed.sql"] },
    "lab-setup": { database: "mini_shop_relations_lab" },
    "lab-read": { database: "mini_shop_relations_lab", files: ["practice/relations-lab/03-read.sql"] },
};
const selected = actions[action];

if (!selected) {
    throw new Error("Lệnh không hợp lệ: setup, lab-setup hoặc lab-read");
}
for (const key of ["PGHOST", "PGPORT", "PGUSER", "PGPASSWORD"]) {
    if (!process.env[key]) throw new Error(`Thiếu ${key} trong .env`);
}
if (action === "setup" && process.env.PGDATABASE !== selected.database) {
    throw new Error("db:setup yêu cầu PGDATABASE=mini_shop; kiểm tra .env trước khi chạy.");
}

// Lab chọn database riêng, không thay đổi PGDATABASE trong .env của API.
const pool = new pg.Pool({ database: selected.database, connectionTimeoutMillis: 5000 });
let client;

async function runFile(path) {
    const sql = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    const results = await client.query(sql);
    console.log(`Đã chạy ${path}`);
    for (const result of Array.isArray(results) ? results : [results]) {
        if (result.rows.length > 0) console.table(result.rows);
    }
}

try {
    client = await pool.connect();
    console.log(`Database: ${selected.database}; role: ${(await client.query("SELECT current_user")).rows[0].current_user}`);

    if (action === "lab-setup") {
        const expectedTables = ["customers", "customer_addresses", "categories", "products", "orders", "order_items"];
        const tables = (await client.query(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
        )).rows.map((row) => row.tablename);

        if (tables.length === 0) {
            await runFile("practice/relations-lab/01-schema.sql");
        } else if (tables.length !== expectedTables.length || !expectedTables.every((name) => tables.includes(name))) {
            throw new Error("Lab có schema khác hoặc chưa đầy đủ. Dừng để kiểm tra, không ghi chồng bảng hiện có.");
        }

        // Tên bảng chỉ lấy từ danh sách cố định bên trên.
        const counts = [];
        for (const name of expectedTables) {
            const result = await client.query(`SELECT COUNT(*)::integer AS count FROM public.${name}`);
            counts.push(result.rows[0].count);
        }
        if (counts.every((count) => count === 0)) {
            await runFile("practice/relations-lab/02-seed.sql");
        } else {
            console.log("Lab đã có dữ liệu; giữ dữ liệu hiện tại, không chạy seed lại.");
        }
        await runFile("practice/relations-lab/03-read.sql");
    } else {
        for (const file of selected.files) await runFile(file);
    }
} catch (error) {
    if (client) {
        try { await client.query("ROLLBACK"); } catch { /* Kết nối có thể đã bị ngắt. */ }
    }
    console.error(`Thiết lập database thất bại (${error.code ?? "UNKNOWN"}): ${error.message}`);
    process.exitCode = 1;
} finally {
    client?.release();
    await pool.end();
}
