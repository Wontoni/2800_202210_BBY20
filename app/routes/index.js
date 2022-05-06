"use strict";

/* ------------------------------ Module ------------------------------ */
const express = require("express");
const router = express.Router();
const path = require("path");

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
    index: path.join(__dirname, "../views", "index.html"),
    signup: path.join(__dirname, "../views", "sign-up.html"),
    login: path.join(__dirname, "../views", "login.html")
};

/* ------------------------------ Routers ------------------------------ */
// show landing page
router.get("/", (req, res) => {
    res.sendFile(directory.index);
});

// show signup page
router.get("/sign-up", (req, res) => {
    res.sendFile(directory.signup);
});

// show login page
router.get("/login", (req, res) => {
    res.sendFile(directory.login);
});

// sign-up => register user info in the database
router.post('/register', (req, res) => {
    db.collection('count').findOne({ name: 'NumberOfUsers' }, (error, result) => {
        // add a user
        let totalUsers = result.totalUser;
        db.collection('user').insertOne({
            _id: totalUsers + 1,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: "regular"
        }, (error, result) => {
            // increment the total number of admin users
            // if (role == "admin") {
            //     db.collection('count').updateOne({ name: 'NumberOfAdmins' }, { $inc: { totalAdmin: 1 } });
            // }
            // increment the total number of users
            db.collection('count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: 1 } }, (error, result) => {
                if (result.acknowledged) {
                    res.redirect("/login");
                }
            });
        });
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;