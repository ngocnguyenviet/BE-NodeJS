const swappingCases = (string) => {
    let swapString = string
        .split("")
        .map((char) => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase())
        .join("");

    return swapString;
};

const test1 = "Le VAn HunG";
console.log(swappingCases(test1));

const test2 = "Đặng PhưƠnG NAm";
console.log(swappingCases(test2));