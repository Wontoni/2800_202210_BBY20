"use strict";

document.getElementById("edit-button").addEventListener("click", () => {
    fetch("/task-edit", {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "_id" : document.getElementById("taskNumber").value,
            "title" : document.getElementById("taskTitle").value,
            "description" : document.getElementById("taskDesc").value,
            "date" : document.getElementById("taskDate").value,
            "startTime" : document.getElementById("taskStart").value,
            "endTime" : document.getElementById("taskEnd").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("edit-message").innerHTML = data.message;
    }).catch(() => {
        const id = document.getElementById("taskNumber").value;
        window.location.href = `/planner`;
    });
});

document.getElementById("delete-button").addEventListener("click", () => {
    fetch("/delete-task", {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "_id" : document.getElementById("taskNumber").value,
            "title" : document.getElementById("taskTitle").value,
            "description" : document.getElementById("taskDesc").value,
            "date" : document.getElementById("taskDate").value,
            "startTime" : document.getElementById("taskStart").value,
            "endTime" : document.getElementById("taskEnd").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("edit-message").innerHTML = data.message;
    }).catch(() => {
        const id = document.getElementById("taskNumber").value;
        window.location.href = `/planner`;
    });
});