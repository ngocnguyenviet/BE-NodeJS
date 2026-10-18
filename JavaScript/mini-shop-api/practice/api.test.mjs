import test from "node:test";
import assert from "node:assert/strict";


const BASE_URL = "http://localhost:3000";

test("GET /health trả đúng hợp đồng", async () => {
    const response = await fetch(`${BASE_URL}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "ok" });
});

test("GET /products/abc trả 400 và lỗi ID", async () => {
    const response = await fetch(`${BASE_URL}/products/abc`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
        error: "ID phải là số nguyên dương thuộc khoảng 1 đến 2147483647",
    });
});

test("GET đường dẫn không tồn tại trả 404 và lỗi fallback", async () => {
    const response = await fetch(`${BASE_URL}/_test_unknown__`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.deepEqual(body, {
        path: "/_test_unknown__",
        error: "Route không tồn tại",
    });
});

test("GET /products?limit=0 trả 400 và lỗi limit", async () => {
    const response = await fetch(`${BASE_URL}/products?limit=0`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
        error: "limit phải là số nguyên dương thuộc từ 1 đến 100"
    });
});


test("GET /products?limit=101 trả 400 và từ chối limit=101", async () => {
    const response = await fetch(`${BASE_URL}/products?limit=101`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
        error: "limit phải là số nguyên dương thuộc từ 1 đến 100"
    });
});

test("GET /products?page=0 trả 400 và từ chối page<=0", async () => {
    const response = await fetch(`${BASE_URL}/products?page=0`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
        error: "page phải là số nguyên dương"
    });
});

test("GET /products?minPrice=-1 trả 400 và từ chối minPrice<0", async () => {
    const response = await fetch(`${BASE_URL}/products?minPrice=-1`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
        error: "minPrice phải là số không âm"
    });
});

