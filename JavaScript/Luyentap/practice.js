// function makeCounter() {
//     let n = 0;
//     return () => ++n;
// }

// const counter = makeCounter();
// console.log(counter(), counter(), typeof n);

// console.log('A');

// Promise.resolve().then(() => console.log('B'));
// setTimeout(() => console.log('C'), 0);

// console.log('D');

const user = { name: 'An' };
const copy = { ...user };
copy.name = 'Binh';
console.log(user.name);
