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
// url
const url = require("url");

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
                adminHTML.window.document.getElementById("userName").innerHTML = req.user.username;
                adminHTML.window.document.getElementById("total-users").innerHTML = result.length + " users";
                res.send(adminHTML.serialize());
            });
            // regular => main.html
        } else if (req.user.role === "regular") {
            const main = fs.readFileSync(directory.main);
            const mainHTML = new JSDOM(main);
            mainHTML.window.document.getElementById("username").innerHTML = req.user.username;
            mainHTML.window.document.getElementById("userAvatar").setAttribute("src", `${req.user.avatar}`);

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
                let totalUsers = result.totalUser;
                db.collection('BBY_20_User').insertOne({
                    _id: totalUsers + 1,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    school: "",
                    avatar: "public/assets/upload/default-avatar.png",
                    role: "regular"
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
                res.sendFile(directory.main);
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

// show edit page
router.get("/edit/:id", (req, res) => {
    const edit = fs.readFileSync(directory.edit);
    const editHTML = new JSDOM(edit);
    db.collection('BBY_20_User').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
        editHTML.window.document.getElementById("userNumber").setAttribute("value", `${result._id}`);
        editHTML.window.document.getElementById("userName").setAttribute("value", `${result.username}`);
        editHTML.window.document.getElementById("userEmail").setAttribute("value", `${result.email}`);
        editHTML.window.document.getElementById("userPassword").setAttribute("value", `${result.password}`);
        editHTML.window.document.getElementById("userRole").setAttribute("value", `${result.role}`);
        editHTML.window.document.getElementById("userSchool").setAttribute("value", `${result.school}`);
        res.send(editHTML.serialize());
    });
});

// edit user information
router.put("/user-edit", (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_User').updateOne({ _id: req.body._id }, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            school: req.body.school
        }
    }, (error, result) => {
        res.redirect("/main");
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;