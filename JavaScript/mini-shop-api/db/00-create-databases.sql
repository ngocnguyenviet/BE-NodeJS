-- Chạy bằng psql với role quản trị, kết nối database postgres.
-- Không xóa database hoặc thay đổi mật khẩu/quyền của role đã tồn tại.
\set ON_ERROR_STOP on

SELECT 'CREATE ROLE devuser LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION'
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'devuser')
\gexec

SELECT 'CREATE DATABASE mini_shop OWNER devuser TEMPLATE template0 ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'mini_shop')
\gexec

SELECT 'CREATE DATABASE mini_shop_relations_lab OWNER devuser TEMPLATE template0 ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'mini_shop_relations_lab')
\gexec

-- Với lần cài mới, dùng \password devuser để đặt mật khẩu tại prompt psql.
