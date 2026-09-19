function FizzBuzz(arg) {
    if (typeof arg !== 'number') {
        console.log("Vui lòng nhập số");
        return;
    } else if (arg % 3 === 0) {
        console.log("Fizz");
    } else if (arg % 5 === 0) {
        console.log("Buzz");
    } else if (arg % 3 === 0 && arg % 5 === 0) {
        console.log("FizzBuzz");
    } else {
        console.log(arg);
    }
}

const checkFizzBuzz1 = FizzBuzz("one");

const checkFizzBuzz2 = FizzBuzz(true);

const checkFizzBuzz3 = FizzBuzz(9);

const checkFizzBuzz4 = FizzBuzz(10);

const checkFizzBuzz5 = FizzBuzz(30);

const checkFizzBuzz6 = FizzBuzz(11);