const capitalize = (string) => {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
};

const makeTitle = (string) => {
    return string.split(" ").map((item) => capitalize(item)).join(" ");
};

const test1 = makeTitle("Fix bug là chuyện dễ. Tìm đoạn code gây ra bug để fix mới là chuyện khó.");
console.log(test1);

const test2 = makeTitle("Khi tui biên dịch và code chạy suôn sẻ trong lần đầu. Tôi tự hỏi đã làm sai chỗ nào đó.");
console.log(test2);