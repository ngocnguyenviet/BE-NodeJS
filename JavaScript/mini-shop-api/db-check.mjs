import { pool } from "./src/db/pool.mjs";

try {
    const result = await pool.query("SELECT 1 AS connected");
    console.log(result.rows);
} catch (error) {
    console.log(error.message);
} finally {
    await pool.end();
}