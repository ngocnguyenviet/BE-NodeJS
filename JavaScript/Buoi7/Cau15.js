const smallWords = (string, number) => {
    const newString = string
        .split(" ")
        .filter((item) => item.length <= number)
        .join(" ");
    return newString;
};

const test1 = "I Love Foood Code Too Playing Much";
console.log(smallWords(test1, 4));