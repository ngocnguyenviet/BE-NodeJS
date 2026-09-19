const person = {
    name: "Le Van A",
    age: 40,
    height: 175,
    country: "Viet Nam",
    designation: "UI Developer",
};

const technology = {
    name: "JavaScript",
    version: 6,
    purpose: "Scripting Language for Web",
    developer: "Netscape Corporation",
}

function showStringProperties(curObj) {
    for (key in curObj) {
        if (typeof curObj[key] === "string") {
            console.log(`${key} : ${curObj[key]}`);
        }
    }
}

showStringProperties(person);

console.log("===================================");

showStringProperties(technology);