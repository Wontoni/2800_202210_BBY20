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
    upload: path.join(__dirname, "../public/assets/upload/")
};

/* ------------------------------ Routers ------------------------------ */
// show profile page
router.get("/profile", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const profile = fs.readFileSync(directory.profile);
        const profileHTML = new JSDOM(profile);

        profileHTML.window.document.getElementById("userAvatar").setAttribute("src", `${req.user.avatar}`);
        profileHTML.window.document.getElementById("username").setAttribute("value", `${req.user.username}`);
        profileHTML.window.document.getElementById("userEmail").setAttribute("value", `${req.user.email}`);
        profileHTML.window.document.getElementById("userPassword").setAttribute("value", `${req.user.password}`);
        profileHTML.window.document.getElementById("userSchool").setAttribute("value", `${req.user.school}`);
        res.send(profileHTML.serialize());
    }
});

// post avatar
router.post("/upload-process", upload.single("avatar"), (req, res) => {
    if (req.user) {
        console.log(req.user);
        db.collection("BBY_20_User").updateOne({
            _id: req.user._id
        }, {
            $set: {
                avatar: req.file.destination + req.file.filename
            }
        }, (error, result) => {
            res.redirect("/profile");
        })
    }
});

// update user profile
router.put("/profile-edit", (req, res) => {
    if (req.user) {
        db.collection("BBY_20_User").updateOne({
            _id : req.user._id
        }, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                school: req.body.school
            }
        }, (error, result) => {
            res.redirect("/profile");
        });
    }
});

// edit user information
// router.put("/profile-edit", (req, res) => {
//     console.log(req.user);
//     db.collection('BBY_20_User').updateOne({ _id: req._id }, {
//         $set: {
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//             school: req.body.school
//         }
//     }, (error, results) => {
//         const edit = fs.readFileSync(directory.edit);
//         const editHTML = new JSDOM(edit);
//         b.collection('BBY_20_User').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
//             editHTML.window.document.getElementById("userName").setAttribute("value", `${result.username}`);
//             editHTML.window.document.getElementById("userEmail").setAttribute("value", `${result.email}`);
//             editHTML.window.document.getElementById("userPassword").setAttribute("value", `${result.password}`);
//             editHTML.window.document.getElementById("userRole").setAttribute("value", `${result.role}`);
//             editHTML.window.document.getElementById("userSchool").setAttribute("value", `${result.school}`);
//             res.send(editHTML.serialize());
//         });
//     })
// })

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;