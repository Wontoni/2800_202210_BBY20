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
    edit: path.join(__dirname, "../public/html", "edit.html")
};

/* ------------------------------ Routers ------------------------------ */
// show signup page
router.get("/sign-up", (req, res) => {
    res.sendFile(directory.signup);
});

// signup process
router.post('/sign-up', (req, res) => {
    db.collection("BBY_20_User").findOne({
        username: req.body.username
    }, (error, result) => {
        let exist = false;
        if (result) {
            exist = true;
        }

        if (exist) {
            res.json({
                message: "This username already exists"
            });
        } else {
            db.collection('BBY_20_Count').findOne({ name: 'NumberOfUsers' }, (error, result) => {
                // add a user
                const defaultSchool = "";
                const defaultAvatarURL = "public/assets/upload/default-avatar.png";
                const defaultRole = "regular";
                db.collection('BBY_20_User').insertOne({
                    _id: result.totalUser + 1,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    school: defaultSchool,
                    avatar: defaultAvatarURL,
                    role: defaultRole
                }, (error, result) => {
                    // increment the total number of users
                    db.collection('BBY_20_Count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: 1 } }, (error, result) => {
                        if (result) {
                            res.redirect("/login");
                        }
                    });
                });
            });
        }
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;