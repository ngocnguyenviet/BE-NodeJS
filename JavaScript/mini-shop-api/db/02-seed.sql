-- Chỉ thêm dữ liệu minh họa khi bảng products hoàn toàn rỗng.
BEGIN;

DO $$
BEGIN
    IF current_database() <> 'mini_shop' THEN
        RAISE EXCEPTION 'Chỉ chạy seed API trong database mini_shop';
    END IF;
END;
$$;

INSERT INTO public.products (name, price)
SELECT seed.name, seed.price
FROM (VALUES ('Áo', 120000), ('Mũ', 50000)) AS seed(name, price)
WHERE NOT EXISTS (SELECT 1 FROM public.products);

COMMIT;
