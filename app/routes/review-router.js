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
        const review = fs.readFileSync(directory.review);
        const reviewHTML = new JSDOM(review);

        var profList = reviewHTML.window.document.getElementById("profList");
        var profTemplate = reviewHTML.window.document.getElementById("profTemplate");

        var maxScoreSpan = reviewHTML.window.document.createElement("span");
        var maxScoreText = reviewHTML.window.document.createTextNode(" / 5");
        maxScoreSpan.appendChild(maxScoreText);

        db.collection("BBY_20_Post").find().sort({ lastModified: -1 }).toArray((error, result) => {
            if (result.length === 0) {
                postTemplate.remove();
            } else {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var name = result[i].name;
                    var school = result[i].school;
                    var stars = result[i].stars;
                    var total = result[i].totalReviews;
                    var profInfo = profTemplate.cloneNode(true);
                    profTemplate.remove();

                    var newScore = stars + "" + maxScoreSpan;
                    profInfo.querySelector("#stars").innerHTML = newScore;
                    profInfo.querySelector("#moreReviews").innerHTML = "See " + total + " reviews";
                    profInfo.querySelector("#profName").innerHTML = name;
                    profList.appendChild(profInfo);
                }
            }
        })


        res.send(reviewHTML.serialize());
    }
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;