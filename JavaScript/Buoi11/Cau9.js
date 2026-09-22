const dataJSON = `{
    "name": "Le Van A",
    "age": 20,
    "email": "levana@gmail.com",
    "address":{
        "street": "So 123, duong ABC",
        "city": "Ha Noi",
        "country": "Viet Nam"
    }
}`;

const dataJS = JSON.parse(dataJSON);

console.log(dataJS.name);
console.log(dataJS.email);
console.log(dataJS.address.city);