const invertedNumbers = (array) => {
    const newArray = array.map((item) => -item);
    return newArray;
};

const test1 = [1, -10, -20, 15, 100, -30];
console.log(invertedNumbers(test1));

const test2 = [-20, 30, 10, -25, -60, 20];
console.log(invertedNumbers(test2));
