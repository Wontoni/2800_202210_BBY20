"use strict";

document.getElementById("edit-button").addEventListener("click", () => {
    fetch("/profile-edit", {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "username" : document.getElementById("username").value,
            "email" : document.getElementById("userEmail").value,
            "password" : document.getElementById("userPassword").value,
            "school" : document.getElementById("userSchool").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("edit-message").innerHTML = data.message;
    }).catch(() => {
        window.location.href = "/profile";
    });
});