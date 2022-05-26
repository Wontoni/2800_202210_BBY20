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
const { devNull } = require("os");

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
    db.collection('BBY_20_Count').findOne({ name: 'NumberOfPosts' }, (error, result) => {
        if (!error) {
            var totalPost = result.totalPost;
            db.collection('BBY_20_Post').insertOne({
                _id: totalPost + 1,
                userID: req.user._id,
                username: req.user.username,
                userAvatar: req.user.avatar,
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
        res.sendFile(directory.login);
    }
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
        res.send(postHTML.serialize());
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;