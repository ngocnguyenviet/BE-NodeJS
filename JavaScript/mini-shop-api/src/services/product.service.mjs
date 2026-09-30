import { pool } from "../db/pool.mjs";


export async function listProducts() {
    const result = await pool.query(
        "SELECT id, name, price FROM products ORDER BY id"
    );

    return result.rows;
}


export async function findProductById(id) {
    const result = await pool.query(
        "SELECT id, name, price FROM products WHERE id = $1",
        [id]
    );
    return result.rows[0];
}

export async function createProduct(name, price) {
    const result = await pool.query(
        `INSERT INTO products (name, price)
        VALUES ($1, $2)
        RETURNING id, name, price
        `, [name, price]
    );
    return result.rows[0];
}
