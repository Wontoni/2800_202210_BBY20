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
    editPost: path.join(__dirname, "../public/html", "edit-post.html"),
    timeline: path.join(__dirname, "../public/html", "timeline.html"),
    friend: path.join(__dirname, "../public/html", "friends.html"),
    easter: path.join(__dirname, "../public/html", "easter.html")
};

/* ------------------------------ Routers ------------------------------ */
// show landing page
router.get("/", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.index);
    } else {
        res.redirect("/main");
    }
});

// show main page by role
router.get("/main", (req, res) => {
    if (req.user) {
        // admin => admin.html
        if (req.user.role === "admin") {
            const admin = fs.readFileSync(directory.admin);
            const adminHTML = new JSDOM(admin);
            adminHTML.window.document.getElementById("username").innerHTML = req.user.username;
            var userTemplate = adminHTML.window.document.getElementById("userTemplate");
            var listTemplate = adminHTML.window.document.getElementById("listTemplate");
            db.collection("BBY_20_User").find().toArray((error, result) => {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var username = result[i].username;
                    var email = result[i].email;
                    var password = result[i].password;
                    var school = result[i].school;
                    var role = result[i].role;
                    var userInfo = userTemplate.cloneNode(true);
                    userTemplate.remove();
                    userInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                    userInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                    userInfo.querySelector("#name").innerHTML = username;
                    userInfo.querySelector("#email").innerHTML = email;
                    userInfo.querySelector("#password").innerHTML = password;
                    userInfo.querySelector("#school").innerHTML = school;
                    userInfo.querySelector("#role").innerHTML = role;
                    listTemplate.appendChild(userInfo);
                }
                adminHTML.window.document.getElementById("total-users").innerHTML = result.length + " users";
                res.send(adminHTML.serialize());
            });
            // regular => main.html
        } else if (req.user.role === "regular") {
            const main = fs.readFileSync(directory.main);
            const mainHTML = new JSDOM(main);
            mainHTML.window.document.getElementById("username").innerHTML = req.user.username;
            mainHTML.window.document.getElementById("userAvatar").setAttribute("src", `${req.user.avatar}`);
            var listTemplate = mainHTML.window.document.getElementById("listTemplate");
            var postTemplate = mainHTML.window.document.getElementById("postTemplate");
            db.collection("BBY_20_Post").find().sort({ lastModified: -1 }).toArray((error, result) => {
                if (result.length === 0) {
                    postTemplate.remove();
                } else {
                    for (var i = 0; i < result.length; i++) {
                        var avatar = result[i].userAvatar;
                        var username = result[i].username;
                        var time = result[i].lastModified;
                        var title = result[i].title;
                        var description = result[i].description;
                        var postInfo = postTemplate.cloneNode(true);
                        postTemplate.remove();
                        postInfo.querySelector("#avatar").setAttribute("src", `/${avatar}`);
                        postInfo.querySelector("#name").innerHTML = username;
                        postInfo.querySelector("#time").innerHTML = time;
                        postInfo.querySelector("#title").innerHTML = title;
                        postInfo.querySelector("#description").innerHTML = description;
                        listTemplate.appendChild(postInfo);
                    }
                }
                res.send(mainHTML.serialize());
            });
        }
    } else {
        res.redirect("/login");
    }
});

// show timeline page
router.get("/timeline", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const timeline = fs.readFileSync(directory.timeline);
        const timelineHTML = new JSDOM(timeline);
        timelineHTML.window.document.getElementById("username").innerHTML = req.user.username + "'s Timeline";
        timelineHTML.window.document.getElementById("userAvatar").setAttribute("src", `${req.user.avatar}`);
        timelineHTML.window.document.getElementById("avatar").setAttribute("src", `${req.user.avatar}`);
        var listTemplate = timelineHTML.window.document.getElementById("listTemplate");
        var postTemplate = timelineHTML.window.document.getElementById("postTemplate");
        db.collection("BBY_20_Post").find({ userID: req.user._id }).sort({ lastModified: -1 }).toArray((error, result) => {
            if (result.length === 0) {
                postTemplate.remove();
            } else {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var username = result[i].username;
                    var time = result[i].lastModified;
                    var title = result[i].title;
                    var description = result[i].description;
                    var postInfo = postTemplate.cloneNode(true);
                    postTemplate.remove();
                    postInfo.querySelector("#name").innerHTML = username;
                    postInfo.querySelector("#time").innerHTML = time;
                    postInfo.querySelector("#title").innerHTML = title;
                    postInfo.querySelector("#description").innerHTML = description;
                    postInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                    postInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                    listTemplate.appendChild(postInfo);
                }
            }
            res.send(timelineHTML.serialize());
        });
    }
});

// delete a post
router.delete('/delete-post', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Post').deleteOne({ _id: req.body._id }, (error, result) => {
        res.sendFile(directory.timeline);
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
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Post').updateOne({ _id: req.body._id }, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            lastModified: new Date()
        }
    }, (error, result) => {
        res.redirect("/timeline");
    });
});

// show easter egg
router.get("/easter", (req, res) => {

    const easter = fs.readFileSync(directory.easter);
    const easterHTML = new JSDOM(easter);
    res.send(easterHTML.serialize());
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;