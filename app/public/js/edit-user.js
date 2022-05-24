"use strict";

document.getElementById("edit-button").addEventListener("click", () => {
    fetch("/user-edit", {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "_id" : document.getElementById("userNumber").value,
            "username" : document.getElementById("userName").value,
            "email" : document.getElementById("userEmail").value,
            "password" : document.getElementById("userPassword").value,
            "school" : document.getElementById("userSchool").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("edit-message").innerHTML = data.message;
    }).catch(() => {
        const id = document.getElementById("userNumber").value
        window.location.href = "/main";
    });
});