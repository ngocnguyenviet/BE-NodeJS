const countOnes = arr => {
    const result = arr.reduce((total, row) => total + row.filter(cell => cell === 1).length, 0);
    return result;
}

const test1 = countOnes([
    [1, 0],
    [0, 0],
]);
console.log(test1);

const test2 = countOnes([
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
]);
console.log(test2);