import pg from "pg";

// Bước 1: chọn tình huống và database riêng cho bài học.
const mode = process.argv[2];
if (!["commit", "rollback"].includes(mode)) {
    throw new Error("Cách chạy: npm run db:lab:transaction -- commit (hoặc rollback)");
}
const pool = new pg.Pool({
    database: "mini_shop_relations_lab",
    connectionTimeoutMillis: 5000,
});

async function showOrder(client, label, orderId) {
    const result = await client.query(`
        SELECT $1::integer AS order_id,
            (SELECT COUNT(*)::integer FROM public.orders WHERE id = $1) AS orders_found,
            (SELECT COUNT(*)::integer FROM public.order_items WHERE order_id = $1) AS items_found
    `, [orderId]);
    console.log(label);
    console.table(result.rows);
    return result.rows[0];
}

async function runDemo() {
    // Bước 2: lấy một client, dùng client này cho toàn bộ transaction.
    const client = await pool.connect();
    let orderId;
    let transactionOpen = false;

    try {
        const database = await client.query("SELECT current_database() AS name");
        if (database.rows[0].name !== "mini_shop_relations_lab") {
            throw new Error("Demo chỉ được ghi vào mini_shop_relations_lab");
        }

        try {
            await client.query("BEGIN");
            transactionOpen = true;
            console.log(`BEGIN (${mode})`);

            // Chọn dữ liệu thật của lab, không giả định ID bắt đầu từ 1.
            const addressResult = await client.query(`
                SELECT a.customer_id, a.recipient_name, a.recipient_phone, a.address_text
                FROM public.customer_addresses AS a
                JOIN public.customers AS c ON c.id = a.customer_id
                WHERE c.is_active = true
                ORDER BY a.id LIMIT 1
            `);
            const productsResult = await client.query(`
                SELECT id, name, price FROM public.products
                WHERE is_active = true ORDER BY id LIMIT 2
            `);
            const address = addressResult.rows[0];
            if (!address || productsResult.rows.length !== 2) {
                throw new Error("Lab cần một địa chỉ và hai sản phẩm hoạt động. Kiểm tra npm run db:lab:read.");
            }

            // Bước 3: thêm đơn hàng và lấy ID do PostgreSQL sinh.
            const orderResult = await client.query(`
                INSERT INTO public.orders (
                    customer_id, recipient_name, recipient_phone, shipping_address
                ) VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [address.customer_id, address.recipient_name, address.recipient_phone, address.address_text]);
            orderId = orderResult.rows[0].id;
            console.log("Đã INSERT orders, id =", orderId);

            // Bước 4: lưu tên/giá hiện tại thành snapshot của mỗi dòng hàng.
            for (const [index, product] of productsResult.rows.entries()) {
                const quantity = mode === "rollback" && index === 1 ? 0 : 1;
                console.log(`Thử INSERT ${product.name}, quantity = ${quantity}`);
                await client.query(`
                    INSERT INTO public.order_items (
                        order_id, product_id, product_name, quantity, unit_price
                    ) VALUES ($1, $2, $3, $4, $5)
                `, [orderId, product.id, product.name, quantity, product.price]);

                if (index === 0) {
                    await showOrder(client, "Trong transaction, sau dòng hàng đầu tiên:", orderId);
                }
            }

            // Nếu constraint bị thiếu, không để lượt rollback vô tình commit.
            if (mode === "rollback") {
                throw new Error("Database không chặn quantity = 0 như schema lab. Hủy transaction để kiểm tra.");
            }

            // Bước 5: mọi câu SQL đều thành công thì lưu cả nhóm.
            await client.query("COMMIT");
            transactionOpen = false;
            console.log("COMMIT: đã lưu đơn và hai dòng hàng.");
        } catch (error) {
            if (transactionOpen) {
                await client.query("ROLLBACK");
                transactionOpen = false;
                console.log("ROLLBACK: đã hủy các thay đổi trong transaction.");
            }
            // Chỉ lỗi quantity của lượt rollback mới là lỗi được cố ý tạo.
            if (mode !== "rollback" || error.code !== "23514" || error.constraint !== "order_items_quantity_check") {
                throw error;
            }
            console.log(`Lỗi dự kiến: ${error.code}, ${error.constraint}`);
        }

        // Bước 6: transaction đã kết thúc; đọc lại để kiểm chứng dữ liệu lưu.
        const saved = await showOrder(client, "Sau khi transaction kết thúc:", orderId);
        const expectedOrders = mode === "commit" ? 1 : 0;
        const expectedItems = mode === "commit" ? 2 : 0;
        if (saved.orders_found !== expectedOrders || saved.items_found !== expectedItems) {
            throw new Error("Số dòng sau transaction không đúng kết quả dự kiến.");
        }
    } finally {
        client.release();
    }
}

try {
    await runDemo();
} catch (error) {
    console.error(`Demo thất bại (${error.code ?? "UNKNOWN"}): ${error.message}`);
    process.exitCode = 1;
} finally {
    // Script CLI kết thúc thì đóng pool. API chạy lâu dài không đóng sau mỗi request.
    await pool.end();
}
