const prompt = require("prompt-sync")();

function extensionFilename(filename) {
    return filename.includes('.') ? filename.split('.').pop() : "Đây không phải tên file.";
}

const input = prompt("Nhập tên file: ");
if (input && input.length > 0) {
    const result = extensionFilename(input);
    if (result === "Đây không phải tên file.") {
        console.log(result);
    } else {
        console.log("Phần mở rộng của file là: " + result);
    }
}