const abbreviate = (string, n = 0) => {
    return (
        string
            .split(" ")
            .filter((word) => word.length >= n)
            .map((item) => item[0])
            .join("")
            .toUpperCase()
    )
}

const test1 = abbreviate("Xin chào! Tôi tên là Nam.");
console.log(test1);

const test2 = abbreviate("Xin chào! Tôi tên là Nam.", 3);
console.log(test2);

const test3 = abbreviate("Xin chào! Tôi tên là Nam.", 4);
console.log(test3);
