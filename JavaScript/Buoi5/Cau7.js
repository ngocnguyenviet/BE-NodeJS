var a = 10;
var b = "20";
var c = 80;

var test1 = ++a + +b++ + +c++ - +a++;
console.log(test1);
console.log(a, b, c);
console.log("------");

var test2 = ++a + -b + +c++ - -a++ + +a;
console.log(test2);
console.log(a, b, c);
console.log("----------------");

var test3 = --c + +b + --a * +b++ - +b * a + --a - +true;
console.log(test3);
console.log(a, b, c);
console.log("--------------");