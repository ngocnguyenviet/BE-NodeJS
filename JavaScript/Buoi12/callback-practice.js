const product = {
    id: 1,
    name: "laptop"
};

function findProductById(id, callback) {
    setTimeout(() => {
        if (id === product.id) {
            callback(null, product);
            return;
        }

        callback(null, null);
    }, 300);
}

findProductById(1, (error, result) => {
    if (error) {
        console.log("Có lỗi: ", error);
        return;
    }
    if (result === null) console.log("Khong tim thay san pham ID 99");
    else console.log("Kết quả tìm ID 1: ", result);
});


findProductById(99, (error, result) => {
    if (error) {
        console.log("Có lỗi: ", error);
        return;
    }

    if (result === null) console.log("Khong tim thay san pham ID 99");
    else console.log("Kết quả tìm ID 1: ", result);
});

console.log("Đã gửi yêu cầu tìm sản phẩm");