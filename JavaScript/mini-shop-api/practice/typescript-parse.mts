import { AppError } from "../src/errors/app-error.mjs";

export type CreateProductInput = {
    name: string;
    price: number;
};

const POSTGRES_INTEGER_MAX = 2 ** 31 - 1;

export function parseCreateProductInput(
    input: unknown
): CreateProductInput {
    if (
        input === null ||
        typeof input !== "object" ||
        Array.isArray(input)
    ) {
        throw new AppError(
            400,
            "INVALID_PRODUCT_INPUT",
            "Dữ liệu phải là một object"
        );
    }

    if (!("name" in input) || !("price" in input)) {
        throw new AppError(
            400,
            "INVALID_PRODUCT_INPUT",
            "thiếu name hoặc price"
        );
    }

    const name = input.name;
    const price = input.price;

    if (typeof name !== "string") {
        throw new AppError(
            400,
            "INVALID_PRODUCT_INPUT",
            "name phải là chuỗi"
        );
    }

    if (typeof price !== "number") {
        throw new AppError(
            400,
            "INVALID_PRODUCT_INPUT",
            "price phải là số"
        );
    }
    const normalizedName = name.trim();

    if (normalizedName.length === 0 || normalizedName.length > 50) {
        throw new AppError(
            400,
            "INVALID_PRODUCT_INPUT",
            "name sau trim() phải dài từ 1-50 ký tự"
        );
    }

    if (
        !Number.isInteger(price) ||
        price < 0 ||
        price > POSTGRES_INTEGER_MAX
    ) {
        throw new AppError(
            400,
            "INVALID_PRODUCT_INPUT",
            `price phải là số nguyên từ 0 đến ${POSTGRES_INTEGER_MAX}`
        );
    }

    return {
        name: normalizedName,
        price,
    };
}