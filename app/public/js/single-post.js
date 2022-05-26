"use strict";

document.getElementById("add-button").addEventListener("click", () => {
    const postID = window.location.pathname.split("/")[2];
    
    fetch("/create-comment", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "postID" : postID,
            "contents" : document.getElementById("contents").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("contents").value = null;
    }).catch(() => {
        window.location.href = `/single-post/${postID}`;
    });
});