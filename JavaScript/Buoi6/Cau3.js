const SPEED_LIMIT = 70;
const KMPERPOINT = 5;
const MONEY = 30000;

function speed(input) {
    if (input <= SPEED_LIMIT) {
        console.log("Vận tốc an toàn");
    } else if (input >= SPEED_LIMIT) {
        let tienPhat = Math.floor((input - SPEED_LIMIT) / KMPERPOINT) * MONEY;
        console.log("Bạn đã bị phạt: " + tienPhat + " đồng");
    }
}