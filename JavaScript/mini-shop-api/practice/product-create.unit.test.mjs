import test from "node:test";
import assert from "node:assert/strict";
import { validateCreateProduct } from "../src/middlewares/product-create.middleware.mjs";
import { response } from "express";

function createContext(body) {
    const observed = {
        statusCode: null,
        responseBody: null,
        nextCalls: 0,
    };

    const req = { body };

    const res = {
        status(code) {
            observed.statusCode = code;
            return res;
        },

        json(value) {
            observed.responseBody = value;
            return res;
        },
    };

    const next = () => {
        observed.nextCalls += 1;
    };

    return { req, res, next, observed };
}

test("Body hợp lệ được chuyển tiếp", () => {
    const { req, res, next, observed } = createContext({
        name: "Bút",
        price: 12000,
    });

    validateCreateProduct(req, res, next);

    assert.equal(observed.nextCalls, 1);
    assert.equal(observed.statusCode, null);
    assert.deepEqual(observed.responseBody, null);
});


test("Body không hợp lệ, price không thỏa mãn, không được chuyển tiếp", () => {
    const { req, res, next, observed } = createContext({
        name: "Bút",
        price: "12000",
    });

    validateCreateProduct(req, res, next);

    assert.equal(observed.nextCalls, 0);
    assert.equal(observed.statusCode, 400);
    assert.deepEqual(observed.responseBody, {
        error: "Dữ liệu sản phẩm không hợp lệ"
    });
});


test("Body không hợp lệ, price không thỏa mãn, không được chuyển tiếp", () => {
    const { req, res, next, observed } = createContext({
        name: "",
        price: 12000,
    });

    validateCreateProduct(req, res, next);

    assert.equal(observed.nextCalls, 0);
    assert.equal(observed.statusCode, 400);
    assert.deepEqual(observed.responseBody, {
        error: "Dữ liệu sản phẩm không hợp lệ"
    });
});

