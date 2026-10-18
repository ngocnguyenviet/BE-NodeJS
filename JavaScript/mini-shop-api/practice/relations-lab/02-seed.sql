-- Dữ liệu giả để học quan hệ và giá tại thời điểm mua.
-- Chạy nguyên file sau 01-schema.sql; không chạy từng đoạn riêng lẻ.
-- Mọi lệnh ghi nằm trong transaction và chỉ được phép ở DB thực hành.
BEGIN;
SET LOCAL client_encoding TO 'UTF8';

DO $$
BEGIN
  IF current_database() <> 'mini_shop_relations_lab' THEN
    RAISE EXCEPTION 'Sai database: %. Cần dùng mini_shop_relations_lab.', current_database();
  END IF;
END;
$$;

-- Chặn chạy seed lần nữa để không nhân dữ liệu.
-- Nếu chưa tạo đủ bảng, PostgreSQL cũng sẽ báo lỗi và hủy transaction.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.customers)
     OR EXISTS (SELECT 1 FROM public.customer_addresses)
     OR EXISTS (SELECT 1 FROM public.categories)
     OR EXISTS (SELECT 1 FROM public.products)
     OR EXISTS (SELECT 1 FROM public.orders)
     OR EXISTS (SELECT 1 FROM public.order_items) THEN
    RAISE EXCEPTION 'Seed yêu cầu toàn bộ 6 bảng rỗng. Dừng để tránh nhân dữ liệu.';
  END IF;
END;
$$;

-- Không gán id: database tự sinh identity cho từng dòng.
INSERT INTO public.customers (full_name, email, phone, created_at)
VALUES
  ('Khách mẫu A', 'customer-a@example.invalid', 'DEMO-001', TIMESTAMPTZ '2026-09-30 09:00:00+07'),
  ('Khách mẫu B', 'customer-b@example.invalid', 'DEMO-002', TIMESTAMPTZ '2026-09-30 09:00:00+07');

INSERT INTO public.customer_addresses (
  customer_id, label, recipient_name, recipient_phone, address_text, created_at
)
SELECT c.id, 'Nhà', c.full_name, c.phone, seed.address_text,
       TIMESTAMPTZ '2026-09-30 09:00:00+07'
FROM (
  VALUES
    ('customer-a@example.invalid', 'Địa chỉ mẫu A'),
    ('customer-b@example.invalid', 'Địa chỉ mẫu B')
) AS seed(email, address_text)
JOIN public.customers AS c ON c.email = seed.email;

INSERT INTO public.categories (name, created_at)
VALUES
  ('Trang phục', TIMESTAMPTZ '2026-09-30 09:00:00+07'),
  ('Phụ kiện', TIMESTAMPTZ '2026-09-30 09:00:00+07');

INSERT INTO public.products (category_id, name, price, created_at)
SELECT cat.id, seed.product_name, seed.price,
       TIMESTAMPTZ '2026-09-30 09:00:00+07'
FROM (
  VALUES
    ('Trang phục', 'Áo', 120000),
    ('Phụ kiện', 'Mũ', 50000)
) AS seed(category_name, product_name, price)
JOIN public.categories AS cat ON cat.name = seed.category_name;

-- Đơn lưu bản chụp thông tin giao hàng; không phụ thuộc địa chỉ hiện tại.
INSERT INTO public.orders (
  customer_id, recipient_name, recipient_phone,
  shipping_address, status, created_at
)
SELECT
  c.id, c.full_name, c.phone,
  seed.shipping_address, 'confirmed', seed.created_at
FROM (
  VALUES
    (
      'customer-a@example.invalid', 'Địa chỉ mẫu A',
      TIMESTAMPTZ '2026-10-01 09:00:00+07'
    ),
    (
      'customer-b@example.invalid', 'Địa chỉ mẫu B',
      TIMESTAMPTZ '2026-10-02 09:00:00+07'
    )
) AS seed(email, shipping_address, created_at)
JOIN public.customers AS c ON c.email = seed.email;

-- Mỗi khách mẫu có đúng một đơn và mỗi tên sản phẩm mẫu có đúng một dòng.
-- Liên kết bằng dữ liệu vừa seed, không giả định id bắt đầu từ 1.
-- Áo được mua với giá 100000, trong khi giá hiện tại là 120000.
INSERT INTO public.order_items (
  order_id, product_id, product_name, quantity, unit_price
)
SELECT o.id, p.id, seed.product_name, seed.quantity, seed.unit_price
FROM (
  VALUES
    ('customer-a@example.invalid', 'Áo', 3, 100000),
    ('customer-a@example.invalid', 'Mũ', 1, 50000),
    ('customer-b@example.invalid', 'Áo', 2, 100000)
) AS seed(email, product_name, quantity, unit_price)
JOIN public.customers AS c ON c.email = seed.email
JOIN public.orders AS o ON o.customer_id = c.id
JOIN public.products AS p ON p.name = seed.product_name;

COMMIT;
