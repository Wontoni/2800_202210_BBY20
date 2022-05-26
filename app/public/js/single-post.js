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

// document.querySelectorAll(".delete-button").addEventListener("click", (e) => {
//     let commentID = e.target.dataset.id;
//     console.log(commentID);
//     fetch("/delete-comment", {
//         method : "DELETE",
//         headers : {
//             "Content-Type" : "application/json"
//         },
//         body : JSON.stringify({
//             commentID : commentID
//         })
//     }).then((res) => {
//         return res.json();
//     }).then((data) => {
//     }).catch(() => {
//         window.location.href = `/single-post/${postID}`;
//     });
// });

$('.delete-button').click((e) => {
    const postID = window.location.pathname.split("/")[2];
    let commentID = e.target.dataset.id;
    $.ajax({
        method : 'DELETE',
        url : '/delete-comment',
        data : {
            commentID : commentID,
            postID : postID
        }
    }).done((result) => {
        window.location.href = `/single-post/${postID}`;
    }).fail((error) => {
        console.log("error");
    });
});