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
    profile: path.join(__dirname, "../public/html", "profile.html"),
    
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
// show login page
router.get("/login", (req, res) => {
    if (!req.user) {
        let msg = req.flash();
        let feedback = "";
        if (msg.error) {
            feedback = msg.error[0];
        }
        const login = fs.readFileSync(directory.login);
        const loginHTML = new JSDOM(login);
        loginHTML.window.document.getElementById("errorMsg").innerHTML = feedback;
        res.send(loginHTML.serialize());
    } else {
        res.redirect("/main");
    }
});

// login process
router.post("/login-process", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    res.redirect("/main");
});

// sign-out => redirect to landing page
router.get("/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;