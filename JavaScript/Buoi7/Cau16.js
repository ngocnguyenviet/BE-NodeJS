const multiplyNumberInString = (string) => {
    const result = string
        .split("")
        .filter((item) => !isNaN(parseInt(item)))
        .map((item) => item * item)
        .join("");
    return result.length > 0 ? result : "0";
};

const test1 = "JG23BGH5BA";
console.log(multiplyNumberInString(test1));

const test2 = "VD23GS8S6AH";
console.log(multiplyNumberInString(test2));

const test3 = "AJSKGBAJSKGB";
console.log(multiplyNumberInString(test3));
