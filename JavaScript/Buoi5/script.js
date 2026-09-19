// alert("Xin chào các bạn!");

// let result = confirm("Bạn đã trên 18 tuổi ?");
// console.log(result);

// let result = prompt("Nhập n: ");
// console.log(result);
// console.warn(result);
// console.error(result);

// setTimeout(function () {
//     console.log("Đã được 5 giây")
// }, 5000);

// let b = setInterval(function () {
//     console.log("B");
// }, 1000);

// setTimeout(function () {
//     clearInterval(b);
// }, 5000);

// let fullName = "Le Van A";
// console.log(fullName.length);

// let myString = "Xin chào! Tôi tên là Ngọc. Tôi năm nay 18 tuổi.";
// console.log(myString.slice(10, 22));
// console.log(myString.slice(0));
// console.log(myString.slice(0, 1));
// console.log(myString.slice(-1));
// console.log(myString);

// console.log(myString.replace("Tôi", "Mình"));
// console.log(myString.replace(/Tôi/g, "Mình"));

// console.log(myString.toLowerCase());
// console.log(myString.toUpperCase());

// let myString = "HTML5  ,  CSS3, Javascript  ";
// myString = myString.replace(/^)
// console.log(myString.split());
// console.log(myString.split(""));
// console.log(myString.split(", "));
// console.log(myString.split(", ", 2));

// let a = 10;
// let b = "Test";
// let result = a / b;
// console.log(result);
// console.log(isNaN(result));
// console.log(typeof (result))

// let list = ["HTML5", "CSS3", "Javascript"];
// console.log(list.toString());

// console.log(list.join());
// console.log(list.join(","));
// console.log(list.join(""));
// console.log(list.join(", "));
// console.log(list.join(" - "));

let list = ["HTML5", "CSS3", "Javascript"];
// console.log(list.pop());
// console.log(list);

// console.log(list.push("Bootstrap 4", "ReactJS"));
// console.log(list);

// console.log(list.shift());
// console.log(list);

// console.log(list.unshift("Bootstrap 4", "ReactJS"));
// console.log(list);

// console.log(list.splice(2, 0, "Bootstrap 4", "ReactJS"));
// console.log(list);

// console.log(list.splice(2, 1));
// console.log(list);

// console.log(list.splice(2, 1, "Bootstrap 4", "ReactJS"));
// console.log(list);

let list2 = ["Bootstrap 4", "ReactJS"];
let mangMoi = [...list, ...list2];
console.log(mangMoi);