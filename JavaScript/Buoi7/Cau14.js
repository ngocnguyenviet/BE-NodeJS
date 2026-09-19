const ignoreNumbers = (string) => {
    const newString = string
        .split(" ")
        .map((item) => (isNaN(parseInt(item)) ? item : ""))
        .join("");
    return newString;
};

const test1 = "Test4Ag54SF";
console.log(ignoreNumbers(test1));

const test2 = "JHk34G13gG";
console.log(ignoreNumbers(test2));
