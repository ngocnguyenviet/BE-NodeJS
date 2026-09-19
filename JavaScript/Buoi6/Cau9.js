let price = 100;
const discount = true;
const discountAmount = 30;
const country = "Viet Nam";

if (discount === true) {
    price -= discountAmount;
} else if (country === "Thai Lan") {
    price -= 40;
} else if (country === "Han Quoc") {
    price -= 50;
} else {
    price -= 10;
}

console.log(price);