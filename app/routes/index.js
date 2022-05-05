"use strict";

/* ------------------------------ Module ------------------------------ */
const express =  require("express");
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
    landing: path.join(__dirname, "../views", "index.html"),
    signup: path.join(__dirname, "../views", "sign-up.html")
};

/* ------------------------------ Routers ------------------------------ */
// show landing page
router.get("/", (req, res) => {
    res.sendFile(directory.landing);
});

// show signup page
router.get("/sign-up", (req, res) => {
    res.sendFile(directory.signup);
});

// sign-up => register user info in the database
router.post('/register', (req, res) => {
    db.collection('count').findOne({ name: 'NumberOfUsers' }, (error, result) => {
        // check if it is null
        if (!req.body.username || !req.body.password) {
            return res.redirect("/sign-up");
        } 
        // set role
        let role = "regular";
        if (req.body.role) {
            role = "admin"
        }
        // add a user
        var totalUsers = result.totalUser;

        db.collection('user').insertOne({
            _id: totalUsers + 1,
            username: req.body.username,
            password: req.body.password,
            role: role
        }, (error, result) => {
            console.log('saved successfully');
            // increment the total number of admin users
            if (role == "admin") {
                db.collection('count').updateOne({name: 'NumberOfAdmins'}, {$inc: { totalAdmin : 1} });
            }
            // increment the total number of users
            db.collection('count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: 1 } }, (error, result) => {
                if (result.acknowledged) {
                    res.redirect("/");
                }
            });
        });
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;