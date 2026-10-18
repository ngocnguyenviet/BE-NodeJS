import { appendFile } from 'node:fs';
import { AppError } from '../../src/errors/app-error.mjs';

export async function createOrder(pool, input) {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        throw new AppError(400, 'INVALID_ORDER_BODY', 'Order body must be an object');
    }
    const { customerId, addressId, items } = input;
    if (
        !Number.isSafeInteger(customerId) ||
        customerId <= 0 ||
        !Number.isSafeInteger(addressId) ||
        addressId <= 0 ||
        !Array.isArray(items) ||
        items.length <= 0
    ) {
        throw new AppError(400, 'INVALID_ORDER_INPUT', 'Invalid customerId, addressId or items');
    }

    const seenProductIds = new Set();

    for (const item of items) {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            throw new AppError(400, 'INVALID_ORDER_ITEM', 'Order item must be object and not null');
        }
        if (!Number.isSafeInteger(item.productId) || item.productId <= 0) {
            throw new AppError(
                400,
                'INVALID_PRODUCT_ID',
                'ProductId must be a positive safe integer',
            );
        }
        if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
            throw new AppError(400, 'INVALID_QUANTITY', 'Quantity must be a positive safe integer');
        }

        if (seenProductIds.has(item.productId)) {
            throw new AppError(
                400,
                'DUPLICATE_PRODUCT_ID',
                `Duplicate product ID: ${items.productId}`,
            );
        }
        seenProductIds.add(item.productId);
    }

    const client = await pool.connect();
    let transactionOpen = false;

    try {
        await client.query('BEGIN');
        transactionOpen = true;

        const addressResult = await client.query(
            `
        SELECT id, customer_id, recipient_name, recipient_phone, address_text
        FROM public.customer_addresses
        WHERE id = $1 AND customer_id = $2
      `,
            [addressId, customerId],
        );
        const address = addressResult.rows[0];
        if (!address) {
            throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Address not found for this customer');
        }

        const preparedItems = [];
        for (const item of items) {
            const productResult = await client.query(
                `SELECT id, name, price
                FROM public.products
                WHERE id = $1 AND is_active = true
            `,
                [item.productId],
            );

            const product = productResult.rows[0];
            if (!product) {
                throw new AppError(404, 'PRODUCT_UNAVAILABLE', 'Product is unavailable');
            }
            preparedItems.push({
                productId: product.id,
                productName: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
            });
        }

        const orderResult = await client.query(
            `
                INSERT INTO public.orders (
                    customer_id,
                    recipient_name,
                    recipient_phone,
                    shipping_address
                ) VALUES ($1, $2, $3, $4)
                 RETURNING id
            `,
            [customerId, address.recipient_name, address.recipient_phone, address.address_text],
        );

        const orderId = orderResult.rows[0].id;

        for (const item of preparedItems) {
            await client.query(
                `
                    INSERT INTO public.order_items (
                        order_id,
                        product_id,
                        product_name,
                        quantity,
                        unit_price
                    ) VALUES ($1, $2, $3, $4, $5)
                `,
                [orderId, item.productId, item.productName, item.quantity, item.unitPrice],
            );
        }
        await client.query('COMMIT');
        transactionOpen = false;
        return { orderId };
    } catch (error) {
        if (transactionOpen) {
            await client.query('ROLLBACK');
            transactionOpen = false;
        }
        throw error;
    } finally {
        client.release();
    }
}
