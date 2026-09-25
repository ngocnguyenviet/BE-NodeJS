// function createCounter() {
//     let count = 0;
//     return function () {
//         count++;
//         return count;
//     };
// }

// const counter = createCounter();

// console.log(counter());
// console.log(counter());

function createMultiplier(number) {
    return function (value) {
        return number * value;
    }
}

const double = createMultiplier(2);
console.log(double(5));