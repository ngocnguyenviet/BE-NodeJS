const students = [
    { hoTen: "Le Van A", lop: "A", diem: 7.5 },
    { hoTen: "Do Van B", lop: "B", diem: 6.8 },
    { hoTen: "Nguyen Thi C", lop: "A", diem: 8 },
    { hoTen: "Dao Van D", lop: "C", diem: 9 },
    { hoTen: "Hoang Thi E", lop: "B", diem: 8.6 },
    { hoTen: "Vu Van F", lop: "B", diem: 7.2 },
];

const sumByClass = students.reduce((totalByClass, item) => {
    const lop = item.lop;
    if (!totalByClass[lop]) {
        totalByClass[lop] = 0;
    }
    totalByClass[lop] += item.diem;
    return totalByClass;
}, {});

console.log(sumByClass);