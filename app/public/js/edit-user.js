"use strict";

document.getElementById("edit-button").addEventListener("click", () => {
    const userID = window.location.pathname.split("/")[2];
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
        window.location.href = `/edit-user/${userID}`;
    });
});