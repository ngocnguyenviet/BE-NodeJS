-- Thiết kế đề xuất cho database thực hành riêng, không phải migration của app.
-- Chạy nguyên file trong mini_shop_relations_lab; chỉ chạy một lần.
-- Quy ước: tiền là VND nguyên đồng. Giá 0 được phép.

BEGIN;
SET LOCAL client_encoding TO 'UTF8';

DO $$
BEGIN
    IF current_database() <> 'mini_shop_relations_lab' THEN
        RAISE EXCEPTION 'Chỉ được chạy trong database mini_shop_relations_lab';
    END IF;
END;
$$;

CREATE TABLE public.customers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name TEXT NOT NULL CHECK (length(btrim(full_name)) > 0),
    email TEXT CHECK (email IS NULL OR length(btrim(email)) > 0),
    phone TEXT NOT NULL CHECK (length(btrim(phone)) > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_addresses (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INTEGER NOT NULL
        REFERENCES public.customers(id) ON DELETE RESTRICT,
    label TEXT NOT NULL CHECK (length(btrim(label)) > 0),
    recipient_name TEXT NOT NULL CHECK (length(btrim(recipient_name)) > 0),
    recipient_phone TEXT NOT NULL CHECK (length(btrim(recipient_phone)) > 0),
    address_text TEXT NOT NULL CHECK (length(btrim(address_text)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE CHECK (length(btrim(name)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id INTEGER NOT NULL
        REFERENCES public.categories(id) ON DELETE RESTRICT,
    name VARCHAR(50) NOT NULL CHECK (length(btrim(name)) > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INTEGER NOT NULL
        REFERENCES public.customers(id) ON DELETE RESTRICT,
    -- Các thông tin giao hàng dưới đây giữ giá trị tại lúc đặt đơn.
    recipient_name TEXT NOT NULL CHECK (length(btrim(recipient_name)) > 0),
    recipient_phone TEXT NOT NULL CHECK (length(btrim(recipient_phone)) > 0),
    shipping_address TEXT NOT NULL CHECK (length(btrim(shipping_address)) > 0),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'shipping', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INTEGER NOT NULL
        REFERENCES public.orders(id) ON DELETE RESTRICT,
    product_id INTEGER NOT NULL
        REFERENCES public.products(id) ON DELETE RESTRICT,
    -- Tên và đơn giá lúc mua; không tính tiền đơn cũ bằng products.price.
    product_name VARCHAR(50) NOT NULL CHECK (length(btrim(product_name)) > 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    CONSTRAINT order_items_order_product_unique UNIQUE (order_id, product_id)
);

-- PK và UNIQUE đã có index. Các index này phục vụ tìm dữ liệu qua FK.
CREATE INDEX customer_addresses_customer_id_idx
    ON public.customer_addresses(customer_id);
CREATE INDEX products_category_id_idx ON public.products(category_id);
CREATE INDEX orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX order_items_product_id_idx ON public.order_items(product_id);

-- Unique (order_id, product_id) đã có order_id làm cột đầu tiên.
-- Yêu cầu đơn có ít nhất một dòng hàng sẽ được xử lý ở bài transaction.
-- CHECK status chỉ giới hạn các giá trị; chưa kiểm soát chuyển trạng thái.

COMMIT;
