"use strict";

/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
// Router
const router = express.Router();
// path
const path = require("path");
// fs
const fs = require("fs");
// JSDOM
const { JSDOM } = require("jsdom");
// directory
const directory = require("./directory");

/* ------------------------------ DB Setting ------------------------------ */
const MongoClient = require("mongodb").MongoClient;
const URL = "mongodb+srv://bby20:unified20@cluster0.wphdm.mongodb.net/Unified?retryWrites=true&w=majority";
let db;
MongoClient.connect(URL, (error, client) => {
    if (error) {
        return console.log(error);
    } else {
        db = client.db("Unified");
    }
});

/* ------------------------------ Routers ------------------------------ */
// show comments
// router.get("/single-post/:id", (req, res) => {
//     if (req.user) {
//         const post = fs.readFileSync(directory.post);
//         const postHTML = new JSDOM(post);

//         let commentContainer = postHTML.window.document.getElementById("comment-container");
//         let commentItem = postHTML.window.document.getElementById("comment-item");

//         db.collection("BBY_20_Comment").find({
//             "postID" : parseInt(req.params.id)
//         }).toArray((error, result) => {
//             for (let i = 0; i < result.length; i++) {
//                 let comment = commentItem.cloneNode(true);
//                 commentItem.remove();
//                 comment.querySelector("#name").innerHTML = result[i].userName;
//                 comment.querySelector("#time").innerHTML = result[i].timestamp;
//                 comment.querySelector("#comment").innerHTML = result[i].contents;
//                 comment.querySelector("#avatar").setAttribute("src", result[i].userAvatar);
//                 commentContainer.appendChild(comment);
//             }
//             res.send(postHTML.serialize());
//         });
//     } else {
//         res.redirect("/login");
//     }
// });

// create a comment
router.post('/create-comment', (req, res) => {
    if (req.user) {
        db.collection('BBY_20_Count').findOne({
            name : 'NumberOfComments'
        }, (error, result) => {
            if (!error) {
                db.collection('BBY_20_Comment').insertOne({
                    "commentID" : result.totalComment + 1,
                    "contents" : req.body.contents,
                    "postID" : req.body.postID,
                    "timestamp" : new Date(),
                    "userID" : req.user._id,
                    "userName" : req.user.username,
                    "userAvatar" : req.user.avatar
                }, (error, result) => {
                    if (!error) {
                        db.collection('BBY_20_Count').updateOne({
                            name : 'NumberOfComments'
                        }, {
                            $inc : {
                                totalComment : 1
                            }
                        }, (error, result) => {
                            if (result.acknowledged) {
                                res.redirect("back");
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.redirect("/login");
    }
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;