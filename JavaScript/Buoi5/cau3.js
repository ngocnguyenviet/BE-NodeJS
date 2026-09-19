function palindrome(string) {
    const reverseString = string.split("").reverse().join("");
    console.log(reverseString);
    return string == reverseString;
}

console.log(palindrome("rotavator"));
console.log(palindrome("hello"));