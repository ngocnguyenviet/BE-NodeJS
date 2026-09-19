const heading = document.getElementById("heading");
console.log("Theo ID: ", heading);

const firstDesc = document.querySelector(".description");
console.log("querySelector: ", firstDesc.textContent);

const secondMenuItem = document.querySelector("#menu li:nth-child(2)");
console.log("Menu item 2:", secondMenuItem.textContent);


const allDesc = document.querySelectorAll(".description");
allDesc.forEach(function (item, index) {
    console.log(`Đoạn văn ${index + 1}: `, item.textContent);
});