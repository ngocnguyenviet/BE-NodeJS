const blahBlah = (string, number) => {
    const words = string.split(" ");

    const newWords = words.map((word, index, arrayOrigin) => {
        return number > arrayOrigin.length - index - 1 ? "blah" : word;
    });

    const newString = newWords.join(" ");
    return `${newString}...`;
}

const test1 = blahBlah("Anh học CNTT hả, cài win dùm em nhé!", 3);
console.log(test1);


const test2 = blahBlah("Cảm giác bất an khi tự dưng một đứa bạn cũ hỏi mình đang học IT phải không.", 5);
console.log(test2);

const test3 = blahBlah("nguyễn việt ngọc", 4);
console.log(test3);