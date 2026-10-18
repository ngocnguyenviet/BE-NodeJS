import pg from "pg";

const { Pool } = pg;

const requiredVariables = ["PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD"];
const missingVariables = requiredVariables.filter((key) => !process.env[key]);

if (missingVariables.length > 0) {
    throw new Error(
        `Thiếu cấu hình ${missingVariables.join(", ")}. Kiểm tra .env và chạy bằng npm start hoặc npm run db:check.`
    );
}

export const pool = new Pool({
    connectionTimeoutMillis: 5000,
});

