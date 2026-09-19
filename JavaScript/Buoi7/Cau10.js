const chooseFuse = (fuses, current) => {
    const num = parseFloat(current);
    const possibleFuse = fuses.map(parseFloat).filter((fuse) => fuse >= num);
    return `${Math.min(...possibleFuse)}V`;
};

const test1 = chooseFuse(["3V", "5V", "12V"], "4.5V");
console.log(test1);

const test2 = chooseFuse(["5V", "14V", "2V"], "5.5V");
console.log(test2);