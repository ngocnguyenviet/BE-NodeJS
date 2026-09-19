function isInteger(value) {
    return value > 0 && value % 1 === 0;
};

var input = prompt("Nhập 1 số bất kỳ", "");
input = parseFloat(input);

if (isNaN(input)) {
    alert("Vui lòng nhập 1 số!");
} else {
    var result = isInteger(input);
    if (result == true) {
        alert("YES");
    } else {
        alert("NO");
    }
}