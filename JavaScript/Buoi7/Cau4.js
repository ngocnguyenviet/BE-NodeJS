const alternatingCaps = (string) => {
    let counter = 0;
    let array = string.split("");

    let newArray = array.map((character) => {
        if (character == " ") return character;
        counter += 1;
        return counter % 2 ? character.toUpperCase() : character.toLowerCase();
    });

    newArray = newArray.join("");
    return newArray;
};

const test1 = alternatingCaps("Khá Bảnh");
console.log(test1);

const test2 = alternatingCaps("Khổ trước sướng sau thế mới giàu");
console.log(test2);

const test3 = alternatingCaps("Nguyễn Việt Ngọc");
console.log(test3);
