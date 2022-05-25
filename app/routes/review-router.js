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
// show review page
router.get("/reviews", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const reviews = fs.readFileSync(directory.review);
        const reviewsHTML = new JSDOM(reviews);

        var listProf = adminHTML.window.document.getElementById("profList");
        var profTemplate = reviewsHTML.window.document.getElementById("profTemplate");
        var maxScoreSpan = document.createElement("span");
        var maxScoreText = document.createTextNode(" / 5");
        maxScoreSpan.appendChild(maxScoreText);
        
        db.collection("BBY_20_Professors").find().toArray((error, result) => {
            for (var i = 0; i < result.length; i++) {
                var number = result[i]._id;
                var name = result[i].name;
                var school = result[i].school;
                var stars = result[i].stars;
                var total = result[i].totalReviews;
                var profInfo = profTemplate.cloneNode(true);
                profTemplate.remove();
                // userInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                var newScore = stars + maxScoreSpan;
                profInfo.querySelector(".score").innerHTML = newScore;
                profInfo.querySelector(".text").innerHTML = "See " + total + " reviews";
                profInfo.querySelector("#profName").innerHTML = name;
                listProf.appendChild(profInfo);
            }
        })

        res.send(reviewsHTML.serialize());
    }
});

// post avatar
router.post("/upload-process", upload.single("avatar"), (req, res) => {
    if (req.user) {
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
            _id: req.user._id
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

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;