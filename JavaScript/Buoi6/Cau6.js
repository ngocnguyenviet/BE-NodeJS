function convertTime(string) {
    const time = string.slice(0, -2);
    const ampm = string.slice(-2);
    const units = time.split(":");

    let hours = units[0];
    const minutes = units[1];
    const seconds = units[2];

    if (hours === "12") {
        hours = "00";
    }

    if (ampm === "PM") {
        hours = parseInt(hours) + 12;
    }

    const newString = [hours, minutes, seconds].join(":");

    return newString;
}

var test1 = convertTime("07:05:45PM");
console.log(test1); // 19:05:45

var test2 = convertTime("12:40:22AM");
console.log(test2); // 00:40:22

var test3 = convertTime("12:45:54PM");
console.log(test3); // 12:45:54