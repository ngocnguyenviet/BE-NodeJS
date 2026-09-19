function leapYear(year) {
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
        return true;
    }
    return false;
}

var test1 = leapYear(2020);
console.log(test1); // true

var test2 = leapYear(2021);
console.log(test2); // false