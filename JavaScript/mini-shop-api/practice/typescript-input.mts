//Mô tả cấu trúc dữ liệu tạo sản phẩm
type CreateProductInput = {
    name: string;
    price: number;
};


//Nhận dữ liệu có kiểu CreateProductInput,
//trả về dữ liệu cũng có kiểu CreateProductInput.
function normalizeProductInput(
    input: CreateProductInput
): CreateProductInput {
    const normalizedName = input.name.trim();

    return {
        name: normalizedName,
        price: input.price,
    };
}

//Dữ liệu minh họa khai báo trong code
const sampleInput: CreateProductInput = {
    name: "Áo",
    price: 100000,
};

const normalizedInput = normalizeProductInput(sampleInput);

console.log("Ban đầu", sampleInput);
console.log("Sau chuẩn đoán: ", normalizedInput);