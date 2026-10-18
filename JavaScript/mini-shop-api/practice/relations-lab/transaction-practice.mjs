import pg from 'pg';

const pool = new pg.Pool({
    database: 'mini_shop_relations_lab',
    connectionTimeoutMillis: 5000,
});

let client;
let transactionOpen = false;
let orderId;

try {
    client = await pool.connect();
    const result1 = await client.query(
        `SELECT current_database() AS database,
        current_user AS role`,
    );
    console.table(result1.rows);

    const result2 = await client.query(
        `SELECT id, name, price FROM products
        ORDER BY id`,
    );
    console.table(result2.rows);

    const product = result2.rows[0];

    if (!product) {
        throw new Error("Lab doesn't have a products");
    }

    const secondProduct = result2.rows[1];
    if (!secondProduct) {
        throw new Error('At least two products are required for this exercise');
    }

    const addressResult = await client.query(`
        SELECT customer_id, recipient_name, recipient_phone, address_text
        FROM public.customer_addresses
        ORDER BY id
        LIMIT 1
      `);

    const address = addressResult.rows[0];

    if (!address) {
        throw new Error("Lab doesn't has template address");
    }

    const items = [
        { product, quantity: 2 },
        { product: secondProduct, quantity: 1 },
    ];

    await client.query('BEGIN');
    transactionOpen = true;

    const orderResult = await client.query(
        `
        INSERT INTO public.orders(
          customer_id,
          recipient_name,
          recipient_phone,
          shipping_address
        )
          VALUES($1, $2, $3, $4)
          RETURNING id
      `,
        [
            address.customer_id,
            address.recipient_name,
            address.recipient_phone,
            address.address_text,
        ],
    );

    orderId = orderResult.rows[0].id;

    for (const item of items) {
        console.log('Inserting item: ', item.product.id, 'quantity: ', item.quantity);
        const itemResult = await client.query(
            `
                INSERT INTO public.order_items (
                    order_id,
                    product_id,
                    product_name,
                    quantity,
                    unit_price
                ) VALUES ($1, $2, $3, $4, $5)
                 RETURNING order_id, product_id, product_name, quantity, unit_price
            `,
            [orderId, item.product.id, item.product.name, item.quantity, item.product.price],
        );

        console.table(itemResult.rows);
    }

    await client.query('COMMIT');
    transactionOpen = false;

    const checkResult = await client.query('SELECT id FROM public.orders WHERE id = $1', [orderId]);
    const itemChecks = await client.query(
        `
        SELECT order_id, product_id, product_name, quantity, unit_price
        FROM public.order_items
        WHERE order_id = $1
        ORDER BY id
        `,
        [orderId],
    );
    console.log("Product's row afterr commit: ");
    console.table(itemChecks.rows);

    console.log('After COMMIT: ', checkResult.rows);
} catch (error) {
    console.error('Transaction failed: ', error.code, error.message);
    if (client && transactionOpen) {
        await client.query('ROLLBACK');
        transactionOpen = false;

        console.log('ROLLBACK completed');

        if (orderId !== undefined) {
            const orderCheck = await client.query(
                `
                SELECT id FROM public.orders WHERE id = $1
                `,
                [orderId],
            );

            const itemCheck = await client.query(
                `
                    SELECT id FROM public.order_items WHERE order_id = $1
                `,
                [orderId],
            );
            console.log('Order after ROLLBACK: ', orderCheck.rows);
            console.log('Item after ROLLBACK: ', itemCheck.rows);
        }
    }
    process.exitCode = 1;
} finally {
    if (client) {
        client.release();
    }
    await pool.end();
}
