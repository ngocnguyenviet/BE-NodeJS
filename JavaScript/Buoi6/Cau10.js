let price = 100;
const discount = false;
const discountAmount = 30;
const country = "Viet Nam";
const student = true;

if (discount === true) {
    price -= discountAmount;
} else if (country === "Viet Nam") {
    if (student === true) {
        price -= discountAmount + 30;
    } else {
        price -= discountAmount + 10;
    }
} else {
    price -= 10;
}

console.log(price);