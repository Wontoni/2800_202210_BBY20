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
// method-override
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

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
    edit: path.join(__dirname, "../public/html", "edit.html")
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
            var userTemplate = adminHTML.window.document.getElementById("userTemplate");
            var listTemplate = adminHTML.window.document.getElementById("listTemplate");
            db.collection("BBY_20_User").find().toArray((error, result) => {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var username = result[i].username;
                    var email = result[i].email;
                    var password = result[i].password;
                    var role = result[i].role;
                    var userInfo = userTemplate.cloneNode(true);
                    userTemplate.remove();
                    userInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                    userInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                    userInfo.querySelector("#name").innerHTML = username;
                    userInfo.querySelector("#email").innerHTML = email;
                    userInfo.querySelector("#password").innerHTML = password;
                    userInfo.querySelector("#role").innerHTML = role;
                    listTemplate.appendChild(userInfo);
                }
                adminHTML.window.document.getElementById("username").innerHTML = req.user.username;
                adminHTML.window.document.getElementById("total-users").innerHTML = result.length + " users";
                res.send(adminHTML.serialize());
            });
            // regular => main.html
        } else if (req.user.role === "regular") {
            const main = fs.readFileSync(directory.main);
            const mainHTML = new JSDOM(main);
            mainHTML.window.document.getElementById("username").innerHTML = req.user.username;
            res.send(mainHTML.serialize());
        }
    } else {
        res.redirect("/login");
    }
});

// show signup page
router.get("/sign-up", (req, res) => {
    res.sendFile(directory.signup);
});

// signup process
router.post('/signup-process', (req, res) => {
    db.collection('BBY_20_Count').findOne({ name: 'NumberOfUsers' }, (error, result) => {
        // add a user
        let totalUsers = result.totalUser;
        db.collection('BBY_20_User').insertOne({
            _id: totalUsers + 1,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            school: "",
            role: "regular"
        }, (error, result) => {
            // increment the total number of users
            db.collection('BBY_20_Count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: 1 } }, (error, result) => {
                if (result.acknowledged) {
                    res.redirect("/login");
                }
            });
        });
    });
});

// show profile page
router.get("/profile", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const profile = fs.readFileSync(directory.profile);
        const profileHTML = new JSDOM(profile);
        profileHTML.window.document.getElementById("username").setAttribute("value", `${req.user.username}`);
        profileHTML.window.document.getElementById("userEmail").setAttribute("value", `${req.user.email}`);
        profileHTML.window.document.getElementById("userPassword").setAttribute("value", `${req.user.password}`);
        profileHTML.window.document.getElementById("userSchool").setAttribute("value", `${req.user.school}`);
        res.send(profileHTML.serialize());
    }
});

// show edit page
router.get("/edit", (req, res) => {
    const edit = fs.readFileSync(directory.edit);
    const editHTML = new JSDOM(edit);
    res.send(editHTML.serialize());
})

// delete a user
router.delete('/delete', (req, res) => {
    req.body._id = parseInt(req.body._id);
    console.log(req.body._id);
    db.collection('BBY_20_User').findOne({ _id: req.body._id }, (error, result) => {
        if (result.role === "admin") {
            db.collection('BBY_20_Count').findOne({ name: 'NumberOfAdmins' }, (error, result) => {
                if (result.totalAdmin === 1) {  // if there is only one admin, not allowed to delete
                    // res.redirect("/main");
                } else {
                    db.collection('BBY_20_User').deleteOne(req.body, (error, result) => {
                        // decrement the total number of users
                        db.collection('BBY_20_Count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: -1 } }, (error, result) => {
                            // decrement the total number of admin users
                            db.collection('BBY_20_Count').updateOne({ name: 'NumberOfAdmins' }, { $inc: { totalAdmin: -1 } }, (error, result) => {
                                // res.redirect("/main");
                            });
                        });
                    });
                }
            });
        } else if (result.role === "regular") {
            db.collection('BBY_20_User').deleteOne(req.body, (error, result) => {
                db.collection('BBY_20_Count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: -1 } }, (error, result) => {
                    // res.redirect("/main");
                });
            });
        }
    });
});

// create a user
router.post('/create', (req, res) => {
    db.collection('BBY_20_Count').findOne({ name: 'NumberOfUsers' }, (error, result) => {
        // add a user
        let totalUsers = result.totalUser;
        db.collection('BBY_20_User').insertOne({
            _id: totalUsers + 1,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            school: "",
            role: "regular"
        }, (error, result) => {
            // increment the total number of users
            db.collection('BBY_20_Count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: 1 } }, (error, result) => {
                if (result.acknowledged) {
                    res.redirect("/main");
                }
            });
        });
    });
});

// edit page
router.get("/edit/:id", (req, res) => {
    const edit = fs.readFileSync(directory.edit);
    const editHTML = new JSDOM(edit);
    db.collection('BBY_20_User').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
        // console.log(result);
        editHTML.window.document.getElementById("userName").setAttribute("value", `${result.username}`);
        editHTML.window.document.getElementById("userEmail").setAttribute("value", `${result.email}`);
        editHTML.window.document.getElementById("userPassword").setAttribute("value", `${result.password}`);
        editHTML.window.document.getElementById("userRole").setAttribute("value", `${result.role}`);
        editHTML.window.document.getElementById("userSchool").setAttribute("value", `${result.school}`);
        res.send(editHTML.serialize());
        // res.sendFile(directory.edit);
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;