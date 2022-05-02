"use strict";

console.log("hihihioh");

fetch("/admin").then((res) => {
    res.json();
}).then((data) => {
    console.log(data);
});