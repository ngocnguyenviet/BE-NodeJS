function waitOneSecond() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Đã chờ xong");
        }, 1000);
    });
}

console.log("Bắt đầu");

waitOneSecond().then((message) => {
    console.log(message);
});

console.log("Tiếp tục chạy");