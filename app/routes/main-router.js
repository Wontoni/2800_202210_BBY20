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

/* ------------------------------ File Directories ------------------------------ */
const directory = {
    index: path.join(__dirname, "../public/html", "index.html"),
    main: path.join(__dirname, "../public/html", "main.html"),
    signup: path.join(__dirname, "../public/html", "sign-up.html"),
    login: path.join(__dirname, "../public/html", "login.html"),
    profile: path.join(__dirname, "../public/html", "profile.html"),
    admin: path.join(__dirname, "../public/html", "admin.html"),
    friend: path.join(__dirname, "../public/html", "friends.html"),
    edit: path.join(__dirname, "../public/html", "edit.html"),
    post: path.join(__dirname, "../public/html", "create-post.html"),
    timeline: path.join(__dirname, "../public/html", "timeline.html"),
};

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
    db.collection('BBY_20_Count').findOne({ name: 'NumberOfPosts' }, (error, result) => {
        if (!error) {
            var totalPost = result.totalPost;
            db.collection('BBY_20_Post').insertOne({
                _id: totalPost + 1,
                userID: req.user._id,
                username:req.user.username,
                title: req.body.title,
                description: req.body.description,
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

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;