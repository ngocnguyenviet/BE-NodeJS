// let a = 10;
// let b = 20;

// if (a > b) {
//     console.log("a lon hon b");
// } else {
//     console.log("a nho hon b");
// }

// for (let i = 0; i <= 10; i++) {
//     console.log(i);
// }

// let infoUser = {
//     fullName: "Nguyễn Việt Ngọc",
//     email: "nguyenvietngoc2006@gmail.com",
//     phone: "012321435236"
// };

// for (key in infoUser) {
//     console.log(`${key} - ${infoUser[key]}`);
// }

// let list = ["HTML5", "CSS3", "Javascript"];

// // console.log(list);
// // console.log(list.length);

// for (let item of list) {
//     console.log(item);
// }

// let string = "Nguyễn Việt Ngọc";
// for (let item of string) {
//     console.log(item);
// }

// function xinChao(name) {
//     return "Xin chào " + name;
// }

// console.log(xinChao("Ngọc"));

// const xinChao = function (name) {
//     return "Xin chào " + name;
// }

// console.log(xinChao("Ngọc"));

// const tinhTong = (a, b) => a + b;

// console.log(tinhTong(10, 20));

// function chaoHoi(name = "bạn") {
//     console.log("Xin chào, " + name);
// }

// chaoHoi("Ngọc");
// chaoHoi();

// function tinhTongTatCa(...numbers) {
//     let tong = 0;

//     for (let num of numbers) {
//         tong += num;
//     }
//     return tong;
// }

// console.log(tinhTongTatCa(1, 2, 3, 4, 5));
// console.log(tinhTongTatCa(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));

// function inKetQua(result) {
//     console.log("Kết quả phép tính là: " + result);
// }

// function tinhTong(a, b, callback) {
//     let result = a + b;
//     callback(result);
// }

// tinhTong(10, 20, inKetQua);

// try {
//     chayChuongTrinh();
// } catch (error) {
//     console.log("Tên lỗi: ", error.name);
//     console.log("Thông báo lỗi: ", error.message);
// } finally {
//     console.log("Kết thúc chương trình");
// }

// function chiaSo(a, b) {
//     try {
//         if (b === 0) {
//             throw new Error("Không thể chia cho 0");
//         }
//         return a / b;
//     } catch (error) {
//         console.log("Xử lý lỗi: ", error.message);
//         return null;
//     }
// }

// console.log(chiaSo(10, 2));
// console.log(chiaSo(10, 0));

// function docFile() {
//     console.log("1. Mở file ...");
//     try {
//         throw new Error("File bị hỏng!");
//         console.log("2. Đọc file thành công");
//     } catch (err) {
//         console.log("3. Bắt lỗi: ", err.message);
//     } finally {
//         console.log("4. Đóng file (luôn chạy)");
//     }
// }

// docFile();

// var infoUser = {
//     name: "Le Van A",
// }

// infoUser.phone = "0123456789";

// // infoUser["phone"] = "0123456789";
// console.log(infoUser);

// delete infoUser.phone;

// console.log(infoUser)

// const numbers = [1, 2, 3, 4];

// numbers.forEach(function (num, index) {
//     console.log("Phần tử tại vị trí " + index + " là: " + num);
// });

// const doubled = numbers.map(function (num) {
//     return num * 2;
// });

// console.log(doubled);

// const scores = [6, 8, 4, 9, 7];

// const allPassed = scores.every(function (score) {
//     return score >= 5;
// });

// console.log(allPassed);

// const score = [8, 9, 4, 7, 10];

// const hasFailedStudent = score.some(function (score) {
//     return score < 5;
// });

// console.log(hasFailedStudent);

// const fruits = ['Táo', 'Cam', 'Xoài'];

// console.log(fruits.includes('Cam'));
// console.log(fruits.includes('Sầu riêng'));

// const numbers = [10, 15, 20, 25, 30];

// const greaterThan18 = numbers.filter(function (num) {
//     return num > 18;
// });

// console.log(greaterThan18);

// const users = [
//     { id: 1, name: "An" },
//     { id: 2, name: "Binh" },
//     { id: 3, name: "Cuong" }
// ];

// const userTwo = users.find(function (user) {
//     return user.id === 2;
// });

// console.log(userTwo);

const cart = [
    { name: "Áo", price: 100 },
    { name: "Quần", price: 200 },
    { name: "Giày", price: 300 }
];

const totalPrice = cart.reduce(function (total, item) {
    return total + item.price;
}, 0);

console.log(totalPrice);