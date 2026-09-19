const sum = (array) => {
    const total = array.reduce((total, number) => total + number, 0);
    return total;
}

const isShapePossible = (n, angles) => {
    if (n < 3) return false;

    if (angles.some((angle) => angle <= 0 || angle >= 180)) return false;
    return sum(angles) === (n - 2) * 180;
};

const test1 = isShapePossible(4, [90, 90, 90, 90]);
console.log(test1);

const test2 = isShapePossible(3, [20, 20, 140]);
console.log(test2);

const test3 = isShapePossible(1, [21]);
console.log(test3);

const test4 = isShapePossible(5, [500, 0, 20, 10, 10]);
console.log(test4);