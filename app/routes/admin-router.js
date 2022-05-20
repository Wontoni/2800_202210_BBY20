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

/* ------------------------------ Directories ------------------------------ */
const directory = {
    index: path.join(__dirname, "../public/html", "index.html"),
    main: path.join(__dirname, "../public/html", "main.html"),
    signup: path.join(__dirname, "../public/html", "sign-up.html"),
    login: path.join(__dirname, "../public/html", "login.html"),
    profile: path.join(__dirname, "../public/html", "profile.html"),
    admin: path.join(__dirname, "../public/html", "admin.html"),
    upload: path.join(__dirname, "../public/assets/upload/"),
    edit: path.join(__dirname, "../public/html", "edit.html")
};

/* ------------------------------ Routers ------------------------------ */
// delete a user
router.delete('/delete', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_User').findOne({ _id: req.body._id }, (error, result) => {
        if (result.role === "admin") {
            db.collection('BBY_20_Count').findOne({ name: 'NumberOfAdmins' }, (error, result) => {
                if (result.totalAdmin === 1) {  // if there is only one admin, not allowed to delete
                    // Popup saying can't delete last admin user
                } else {
                    db.collection('BBY_20_User').deleteOne(req.body, (error, result) => {
                        // decrement the total number of admin users
                        db.collection('BBY_20_Count').updateOne({ name: 'NumberOfAdmins' }, { $inc: { totalAdmin: -1 } }, (error, result) => {
                            res.sendFile(directory.main);
                        });
                    });
                }
            });
        } else if (result.role === "regular") {
            db.collection('BBY_20_User').deleteOne(req.body, (error, result) => {
                db.collection('BBY_20_Post').deleteMany({ userID: parseInt(req.body._id) }, (error, result) => {
                    res.sendFile(directory.main);
                });
            });
        }
    });
});

// create a user
router.post('/create', (req, res) => {
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
                let totalUsers = result.totalUser;
                const defaultSchool = "";
                const defaultAvatarURL = "public/assets/upload/default-avatar.png";
                const defaultRole = "regular";
                db.collection('BBY_20_User').insertOne({
                    _id: totalUsers + 1,
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
                            res.redirect("/main");
                        }
                    });
                });
            });
        }
    });
});

// show edit page
router.get("/edit/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const edit = fs.readFileSync(directory.edit);
        const editHTML = new JSDOM(edit);
        db.collection('BBY_20_User').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            editHTML.window.document.getElementById("userNumber").setAttribute("value", `${result._id}`);
            editHTML.window.document.getElementById("userName").setAttribute("value", `${result.username}`);
            editHTML.window.document.getElementById("userEmail").setAttribute("value", `${result.email}`);
            editHTML.window.document.getElementById("userPassword").setAttribute("value", `${result.password}`);
            editHTML.window.document.getElementById("userSchool").setAttribute("value", `${result.school}`);
            res.send(editHTML.serialize());
        });
    }
});

// edit user information
router.put("/user-edit", (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_User').updateOne({ _id: req.body._id }, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            school: req.body.school
        }
    }, (error, result) => {
        db.collection('BBY_20_Post').updateMany({ userID: req.body._id }, {
            $set: {
                username: req.body.username
            }
        }, (error, result) => {
            res.redirect("/main");
        });
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;