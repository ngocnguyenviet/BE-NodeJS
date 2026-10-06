console.log("A");
setTimeout(() => console.log("B"), 0);
const p = new Promise((resolve) => {
    console.log("C");
    resolve();
});

p.then(() => console.log("D"));


async function run() {
    console.log("E");
    await p;
    console.log("F");
}

run();
console.log("G");

const startedAt = Date.now();

while (Date.now() - startedAt < 300) {

}

console.log("H: hết bận", Date.now() - startedAt, "ms");
