"use strict";

document.getElementById("create-button").addEventListener("click", () => {
    fetch("/new-task", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "title" : document.getElementById("taskTitle").value,
            "description" : document.getElementById("taskDesc").value,
            "date" : document.getElementById("taskDate").value,
            "startTime" : document.getElementById("taskStart").value,
            "endTime" : document.getElementById("taskEnd").value,
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("taskTitle").value = null;
        document.getElementById("taskDesc").value = null;
        document.getElementById("taskDate").value = null;
        document.getElementById("taskStart").value = null;
        document.getElementById("taskEnd").value = null;
        document.getElementById("create-message").innerHTML = data.message;
    }).catch(() => {
        window.location.href = "/planner";
    });
});