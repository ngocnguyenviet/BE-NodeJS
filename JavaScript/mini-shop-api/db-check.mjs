import { pool } from "./src/db/pool.mjs";

try {
    const result = await pool.query(
        "SELECT current_database() AS database, current_user AS role"
    );
    console.table(result.rows);
    const products = await pool.query("SELECT COUNT(*)::integer AS product_count FROM public.products");
    console.table(products.rows);
} catch (error) {
    console.error(`Kiểm tra database thất bại (${error.code ?? "UNKNOWN"}): ${error.message}`);
    process.exitCode = 1;
} finally {
    await pool.end();
}
