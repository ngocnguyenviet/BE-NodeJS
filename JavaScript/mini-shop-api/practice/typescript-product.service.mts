import type { CreateProductInput } from "./typescript-parse.mts";

export type ProductPreview = {
    name: string;
    price: number;
    priceLabel: string;
};

const priceFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

export function buildProductsPreview(
    input: CreateProductInput
): ProductPreview {
    return {
        name: input.name,
        price: input.price,
        priceLabel: priceFormatter.format(input.price),
    };
}



