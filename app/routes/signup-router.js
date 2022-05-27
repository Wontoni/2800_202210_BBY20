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
                        if (result.acknowledged) {
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