function hieuDienTich(r) {
    if (r <= 0) console.log("Bán kính không dương");
    else {
        let vuong1 = (2 * r) ** 2;
        let vuong2 = (Math.sqrt(2) * r) ** 2;
        return Math.abs(vuong1 - vuong2);
    }
}

let test1 = hieuDienTich(5);
console.log(test1);

let test2 = hieuDienTich(6);
console.log(test2);

let test3 = hieuDienTich(7);
console.log(test3);