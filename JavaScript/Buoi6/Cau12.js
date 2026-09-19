const myFriends = [1, 2, "Nam", "Hùng", 3, 4, "Hòa", 6, "Long"];

const myFriends2 = myFriends.filter((friend) => typeof friend === "string");
console.log(myFriends2);
