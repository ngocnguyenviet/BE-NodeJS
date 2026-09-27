const numbers = [2, 4, 6];

const sum = numbers.reduce((total, number) => {
    return total + number;
}, 0);
console.log(sum);

function countTotalProducts(items) {
    return items.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}