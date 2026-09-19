// console.log(window);

// // window.alert("Oke");

// console.log(window.innerHeight);
// console.log(window.innerWidth);
// var myWindow;
// const openTab = () => {
//     myWindow = window.open("https://28tech.com.vn/", "_blank", "width = 1200, height = 600, left=100, top=50");
// };

// const closeTab = () => {
//     myWindow.close();
// };

// console.log(screen.height);
// console.log(screen.width);

// console.log(location);

// const reloadPage = () => {
//     location.reload();
// };

// setInterval(() => {
//     location.reload();
// }, 2000);

// console.log(location);

// console.log(history);

// console.log(navigator);

// setTimeout(() => {
//     console.log("Hiển thị quảng cáo sau 5s");
// }, 5000);

// setInterval(() => {
//     console.log("Thời gian hiện tại:", new Date().toLocaleDateString());
// }, 1000);

// document.cookie = "name=value";

// function setCookie(cname, cvalue, exdays){
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     var expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + "; "+ expires;
// };

// var giaTri = document.cookie;

// const getCookie = (cname) => {
//     var name = cname +  "=";
//     var ca = document.cookie.split(";");
//     for (var i = 0; i < ca.length; i++){
//         var c = ca[i];
//         while(c.charAt(0) == " "){
//             c = c.substring(1);
//         }
//         if(c.indexOf(name) == 0){
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// };

function setCookies(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${encodeURIComponent(cvalue)}; ${expires}; path=/`;
}

// const fullName = prompt("Nhập tên của bạn");
// if (fullName) {
//     console.log("Ten vua nhap:", fullName);
//     setCookies("fullName", fullName, 3);
//     console.log("Cookie hien tai:", document.cookie);
// } else {
//     console.log("Nguoi dung chua nhap ten hoac bam huy.");
// }

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
    document.cookie = `${cname}=;expires=Thu, 01 Jan 1970
    00:00:00 UTC`;
}

const cookie = document.cookie;
console.log(cookie);

console.log(getCookie("phone"));

deleteCookie(fullName);