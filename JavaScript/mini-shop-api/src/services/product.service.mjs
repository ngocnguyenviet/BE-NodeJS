import { pool } from "../db/pool.mjs";


export async function listProducts({ minPrice, maxPrice, limit = 10, offset = 0 } = {}) {
    const conditions = [];
    const values = [];

    if (minPrice !== undefined) {
        values.push(minPrice);
        conditions.push(`price >= $${values.length}::numeric`);
    }

    if (maxPrice !== undefined) {
        values.push(maxPrice);
        conditions.push(`price <= $${values.length}::numeric`);
    }

    let sql = "SELECT id, name, price FROM products";

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    values.push(limit);
    const limitIndex = values.length;

    values.push(offset);
    const offsetIndex = values.length;

    sql += ` ORDER BY id LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
    const result = await pool.query(sql, values);
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

export async function updateProductPrice(id, price) {
    const result = await pool.query(
        `UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price`, [price, id]
    );
    return result.rows[0];
}


export async function deleteProductById(id) {
    const result = await pool.query(
        `
        DELETE FROM products
        WHERE id = $1
        RETURNING id, name, price;
        `, [id]
    );
    return result.rows[0];
}
