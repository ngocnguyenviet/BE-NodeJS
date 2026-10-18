-- Schema cho API hiện tại; khác schema sáu bảng của relations-lab.
BEGIN;

DO $$
BEGIN
    IF current_database() <> 'mini_shop' THEN
        RAISE EXCEPTION 'Chỉ chạy schema API trong database mini_shop';
    END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL CHECK (length(btrim(name)) > 0),
    -- Giá VND nguyên đồng, khớp validation của API.
    price INTEGER NOT NULL CHECK (price >= 0)
);

COMMIT;
