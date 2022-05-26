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
const { resourceLimits } = require("worker_threads");

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
// Show professors page
router.get("/professors", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        console.log("hey");
        const professors = fs.readFileSync(directory.adminProfessors);
        const professorsProfHTML = new JSDOM(professors);

        var professorsTemplate = professorsProfHTML.window.document.getElementById("professorsTemplate");
        var listTemplate = professorsProfHTML.window.document.getElementById("listTemplate");
        db.collection("BBY_20_Professors").find().sort({ lastModified: -1 }).toArray((error, result) => {
            if (result.length === 0) {
                professorsTemplate.remove();
            } else {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var name = result[i].name;
                    var school = result[i].school;

                    var professorsInfo = professorsTemplate.cloneNode(true);
                    professorsTemplate.remove();
                    professorsInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                    professorsInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                    professorsInfo.querySelector("#title").innerHTML = name;
                    professorsInfo.querySelector("#description").innerHTML = school;

                    listTemplate.appendChild(professorsInfo);
                }
            }
            professorsProfHTML.window.document.getElementById("total-professors").innerHTML = result.length + " Professors";
            res.send(professorsProfHTML.serialize());
        });

    }
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;