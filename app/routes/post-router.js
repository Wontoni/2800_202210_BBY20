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
// sanitize-html
const sanitizeHTML = require("sanitize-html");

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
// show create-post page
router.get("/create-post", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const post = fs.readFileSync(directory.post);
        const postHTML = new JSDOM(post);
        postHTML.window.document.getElementById("username").innerHTML = req.user.username;
        postHTML.window.document.getElementById("userAvatar").setAttribute("src", `${req.user.avatar}`);
        res.send(postHTML.serialize());
    }
});

// create a post
router.post('/create-post', (req, res) => {
    let sanitizedTitle = sanitizeHTML(req.body.title);
    let sanitizedDescription = sanitizeHTML(req.body.description, {
        allowedTags:['img'],
        allowedAttributes: {
            img: ['src', 'align']
        },
        allowedSchemes: [ 'data', 'http', 'https']
    });

    db.collection('BBY_20_Count').findOne({ name: 'NumberOfPosts' }, (error, result) => {
        if (!error) {
            var totalPost = result.totalPost;
            db.collection('BBY_20_Post').insertOne({
                _id: totalPost + 1,
                userID: req.user._id,
                username: req.user.username,
                userAvatar: req.user.avatar,
                title: sanitizedTitle,
                description: sanitizedDescription,
                lastModified: new Date()
            }, (error, result) => {
                if (!error) {
                    db.collection('BBY_20_Count').updateOne({
                        name: 'NumberOfPosts'
                    }, {
                        $inc: { totalPost: 1 }
                    }, (error, result) => {
                        if (result.acknowledged) {
                            res.redirect("/main");
                        }
                    });
                }
            });
        }
    });
});

// show edit post page
router.get("/edit-post/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const editPost = fs.readFileSync(directory.editPost);
        const editPostHTML = new JSDOM(editPost);
        editPostHTML.window.document.getElementById("username").innerHTML = req.user.username;
        editPostHTML.window.document.getElementById("userAvatar").setAttribute("src", `/${req.user.avatar}`);
        db.collection('BBY_20_Post').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            editPostHTML.window.document.getElementById("postNumber").setAttribute("value", `${req.params.id}`);
            editPostHTML.window.document.getElementById("title").setAttribute("value", `${result.title}`);
            editPostHTML.window.document.getElementById("tiny-editor").textContent = `${result.description}`;
            res.send(editPostHTML.serialize());
        });
    }
});

// edit a post
router.put("/post-edit", (req, res) => {
    let sanitizedTitle = sanitizeHTML(req.body.title);
    let sanitizedDescription = sanitizeHTML(req.body.description, {
        allowedTags:['img'],
        allowedAttributes: {
            img: ['src', 'align']
        },
        allowedSchemes: [ 'data', 'http', 'https']
    });

    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Post').updateOne({ _id: req.body._id }, {
        $set: {
            title: sanitizedTitle,
            description: sanitizedDescription,
            lastModified: new Date()
        }
    }, (error, result) => {
        res.redirect("/timeline");
    });
});

// delete a post
router.delete('/delete-post', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Post').deleteOne({ _id: req.body._id }, (error, result) => {
        res.sendFile(directory.timeline);
    });
});

// show post page
router.get('/single-post/:id', (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const post = fs.readFileSync(directory.singlePost);
        const postHTML = new JSDOM(post);
    
        postHTML.window.document.getElementById("username").innerHTML = req.user.username;
        postHTML.window.document.getElementById("userAvatar").setAttribute("src", `/${req.user.avatar}`);
    
        db.collection('BBY_20_Post').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            postHTML.window.document.getElementById("avatar").setAttribute("src", `/${result.userAvatar}`);
            postHTML.window.document.getElementById("name").innerHTML = result.username;
            postHTML.window.document.getElementById("time").innerHTML = result.lastModified;
            postHTML.window.document.getElementById("title").innerHTML = result.title;
            postHTML.window.document.getElementById("description").innerHTML = result.description;
    
            let commentContainer = postHTML.window.document.getElementById("comment-container");
            let commentItem = postHTML.window.document.getElementById("comment-item");
    
            db.collection("BBY_20_Comment").find({
                postID : req.params.id
            }).toArray((error, comments) => {
                if (comments.length === 0) {
                    commentItem.remove();
                } else {
                    for (let i = 0; i < comments.length; i++) {
                        let comment = commentItem.cloneNode(true);
                        commentItem.remove();
                        comment.querySelector("#time").innerHTML = comments[i].timestamp;
                        comment.querySelector("#comment").innerHTML = comments[i].contents;
                        comment.querySelector("#name").innerHTML = comments[i].userName;
                        comment.querySelector("#commentAvatar").setAttribute("src", `/${comments[i].userAvatar}`);
                        comment.querySelector(".delete-button").setAttribute("data-id", comments[i].commentID);
                        commentContainer.appendChild(comment);
                    }
                }
                res.send(postHTML.serialize());
            });
        });
    }
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;