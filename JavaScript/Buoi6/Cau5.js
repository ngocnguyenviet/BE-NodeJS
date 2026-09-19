function isPrimeNumber(num) {
    for (let factor = 2; factor < num; factor++) {
        if (num % factor === 0) {
            return false;
        }
    }
    return true;
}

function showPrimeNumber(numberLimit) {
    for (let curNum = 2; curNum <= numberLimit; curNum++) {
        if (isPrimeNumber(curNum)) {
            console.log("Số nguyên tố: " + curNum);
        }
    }
}

showPrimeNumber(20);


