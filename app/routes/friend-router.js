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
// multer
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets/upload/");
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        cb(null, req.user._id + "_" + req.user.username + ext);
    }
    // filefilter
});
const upload = multer({
    storage: storage
});
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
    friend: path.join(__dirname, "../public/assets/friends.html")
};

/* ------------------------------ Routers ------------------------------ */
// show friends page
router.get("/friends", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const friends = fs.readFileSync(directory.friend);
        const friendsHTML = new JSDOM(friends);

        res.send(friendsHTML.serialize());
    }
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;