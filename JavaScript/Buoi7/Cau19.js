const numbers = [
    [1, 2],
    [3, 4],
    [5, 6],
];

const sumByGroup = numbers.reduce((groups, item) => {
    const sum = item.reduce((total, value) => total + value, 0);
    groups.push(sum);
    return groups;
}, []);

console.log(sumByGroup);
