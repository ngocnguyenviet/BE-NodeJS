const p = new Promise((resolve) => {
    console.log("executor");
    resolve("OK");
});

p.then((value) => console.log("then:", value));
console.log("cuối đoạn đồng bộ");