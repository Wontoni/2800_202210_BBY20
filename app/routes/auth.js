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
//JSDOM
const {JSDOM} = require("jsdom");
// html templates
var regularTemplate = require('../public/templates/regular');
var adminTemplate = require('../public/templates/admin');
var loginTemplate = require('../public/templates/login');
// flash
const flash = require("connect-flash");
router.use(flash());
// passport
const passport = require("passport");

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
    main: path.join(__dirname, "../public/html", "main.html"),
    admin: path.join(__dirname, "../public/html", "admin.html"),
    login: path.join(__dirname, "../public/html", "login.html"),
    index: path.join(__dirname, "../public/html", "index.html"),
    profile: path.join(__dirname, "../public/html", "profile.html")
};

/* ------------------------------ Middleware Function ------------------------------ */
function isSignedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect("/login");
    }
};

/* ------------------------------ Routers ------------------------------ */
// sign-in => redirect by users' role
router.get("/main", isSignedIn, (req, res) => {
    // if user.role is admin, show admin.html
    if (req.user.role === "admin") {
        db.collection("BBY_20_User").find().toArray((error, result) => {
            var next = "<br><br>";
            var button = "&nbsp<button>EDIT</button>";
            var list = "";
            for (var i = 0; i < result.length; i++) {
                list += JSON.stringify(result[i]) + button + next;
            }
            var html = adminTemplate.HTML(list);
            res.send(html);
        });
        // if user.role is regular, show main.html
    } else if (req.user.role === "regular") {

        var name = "";
        name = req.user.username;
        var html = regularTemplate.HTML(name);
        res.send(html);
    }
});

// show login page
router.get("/login", (req, res, next) => {
    // middleware => logged in user cannot access login page
    if (!req.user) {
        next();
    } else {
        res.redirect(`/main?username=${req.user.username}`);
    }
}, (req, res) => {
    let msg = req.flash();
    let feedback = "";
    if (msg.error) {
        feedback = msg.error[0];
    }
    var html = loginTemplate.HTML(feedback);
    res.send(html);
});

//authenticate
router.post("/login-process", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    res.redirect(`/main?username=${req.body.username}`);
});

// sign-out => redirect to landing page
router.get("/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

// show landing page
router.get("/", (req, res, next) => {
    // middleware => logged in user cannot access landing page
    if (!req.user) {
        next();
    } else {
        res.redirect(`/main?username=${req.user.username}`);
    }
}, (req, res) => {
    res.sendFile(directory.index);
});

// show profile page
router.get("/profile", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const profile = fs.readFileSync(directory.profile);
        const profileHTML = new JSDOM(profile);
        console.log(req.user);
        profileHTML.window.document.getElementById("username").setAttribute("value", `${req.user.username}`);
        profileHTML.window.document.getElementById("userEmail").setAttribute("value", `${req.user.email}`);
        profileHTML.window.document.getElementById("userPassword").setAttribute("value", `${req.user.password}`);
        profileHTML.window.document.getElementById("userSchool").setAttribute("value", `${req.user.school}`);
        res.set("Developed-By", "BBY-20");
        res.set("BCIT-CST", "COMP2537");
        res.send(profileHTML.serialize());
    }
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;