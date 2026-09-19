const sum = (arr) => {
    return arr.reduce((total, num) => total + num, 0);
};

const mean = (arr) => {
    return sum(arr) / arr.length;
};

const median = (arr) => {
    const numberBefore = arr[Math.floor((arr.length - 1) / 2)];
    const numberAfter = arr[Math.ceil((arr.length - 1) / 2)];

    return mean([numberBefore, numberAfter]);
};

const test1 = median([1, 2, 4, 5, 6, 8, 8, 8, 10]);
console.log(test1);

const test2 = median([2, 2, 6, 8, 8, 10, 10]);
console.log(test2);

const test3 = median([1, 2, 2, 4, 7, 8, 9, 10]);
console.log(test3);

