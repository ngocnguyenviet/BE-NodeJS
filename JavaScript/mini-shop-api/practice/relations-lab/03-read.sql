-- Chạy nguyên file trên DB thực hành đã tạo schema và seed.
-- READ ONLY chặn thao tác ghi trong transaction này.
BEGIN READ ONLY;
SET LOCAL client_encoding TO 'UTF8';

DO $$
BEGIN
  IF current_database() <> 'mini_shop_relations_lab' THEN
    RAISE EXCEPTION 'Sai database: %. Cần dùng mini_shop_relations_lab.', current_database();
  END IF;
END;
$$;

-- Số dòng mong đợi: 2 khách, 2 địa chỉ, 2 danh mục,
-- 2 sản phẩm, 2 đơn hàng và 3 dòng hàng.
SELECT 'customers' AS table_name, COUNT(*) AS row_count FROM public.customers
UNION ALL
SELECT 'customer_addresses', COUNT(*) FROM public.customer_addresses
UNION ALL
SELECT 'categories', COUNT(*) FROM public.categories
UNION ALL
SELECT 'products', COUNT(*) FROM public.products
UNION ALL
SELECT 'orders', COUNT(*) FROM public.orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM public.order_items;

-- Một dòng kết quả cho mỗi dòng hàng: order_id có thể lặp.
-- Tên và giá mua lấy từ snapshot; giá hiện tại lấy từ products.
-- Ép bigint trước phép nhân để tránh tràn integer khi tính tiền.
SELECT
  o.id AS order_id,
  c.full_name AS customer_name,
  oi.id AS order_item_id,
  oi.product_name AS purchased_product_name,
  p.price AS current_product_price,
  oi.quantity,
  oi.unit_price,
  oi.quantity::bigint * oi.unit_price AS line_total
FROM public.orders AS o
INNER JOIN public.customers AS c ON c.id = o.customer_id
INNER JOIN public.order_items AS oi ON oi.order_id = o.id
INNER JOIN public.products AS p ON p.id = oi.product_id
ORDER BY o.id, oi.id;

-- Một dòng kết quả cho mỗi đơn có dòng hàng.
-- INNER JOIN không đưa đơn chưa có dòng hàng vào kết quả.
-- Tổng mong đợi: Khách mẫu A = 350000; Khách mẫu B = 200000.
SELECT
  o.id AS order_id,
  c.full_name AS customer_name,
  SUM(oi.quantity::bigint * oi.unit_price) AS total_amount
FROM public.orders AS o
INNER JOIN public.customers AS c ON c.id = o.customer_id
INNER JOIN public.order_items AS oi ON oi.order_id = o.id
GROUP BY o.id, c.full_name
ORDER BY o.id;

COMMIT;
