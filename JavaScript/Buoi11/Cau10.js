const dataJSON = `[
    {
        "name": "Le Van A",
        "age": 30,
        "skills": ["JavaScript", "HTML", "CSS"]
    },
    {
        "name": "Nguyen Thi B",
        "age": 25,
        "skills": ["Python", "Java", "C++"]
    },
    {
        "name": "Do van C",
        "age": 35,
        "skills": ["Ruby", "PHP", "SQL"]
    }
]`;

const dataJS = JSON.parse(dataJSON);
const namesArray = dataJS.map((obj) => obj.name);
console.log(namesArray);