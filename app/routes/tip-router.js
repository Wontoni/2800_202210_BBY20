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
// Show tips page
router.get("/tips", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {

        const tips = fs.readFileSync(directory.tips);
        const tipsHTML = new JSDOM(tips);
        tipsHTML.window.document.getElementById("username").innerHTML = req.user.username;
        var tipsTemplate = tipsHTML.window.document.getElementById("tipsTemplate");
        var listTemplate = tipsHTML.window.document.getElementById("listTemplate");
        db.collection("BBY_20_Tips").find().toArray((error, result) => {
            for (var i = 0; i < result.length; i++) {
                var number = result[i]._id;
                var title = result[i].title;
                var desc = result[i].description;

                var tipsInfo = tipsTemplate.cloneNode(true);
                tipsTemplate.remove();
                tipsInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                tipsInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                tipsInfo.querySelector("#title").innerHTML = title;
                tipsInfo.querySelector("#description").innerHTML = desc;

                listTemplate.appendChild(tipsInfo);
            }
            tipsHTML.window.document.getElementById("total-tips").innerHTML = result.length + " tips";
            res.send(tipsHTML.serialize());
        });

    }
});

// delete a tip
router.delete('/delete-tip', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Tips').findOne({ _id: req.body._id }, (error, result) => {

        db.collection('BBY_20_Count').findOne({ name: 'NumberOfTips' }, (error, result) => {

            db.collection('BBY_20_Tips').deleteOne(req.body, (error, result) => {
                // decrement the total number of tips
                db.collection('BBY_20_Count').updateOne({ name: 'NumberOfTips' }, { $inc: { totalTips: -1 } }, (error, result) => {
                    res.sendFile(directory.tips);
                });
            });

        });
    });
});

// create a tip
router.post('/tip-create', (req, res) => {
    db.collection("BBY_20_Tips").findOne({
        title: req.body.title
    }, (error, result) => {
        let exist = false;
        if (result) {
            exist = true;
        }

        if (exist) {
            res.json({
                message: "This tips already exists"
            });
        } else {
            db.collection('BBY_20_Count').findOne({ name: 'NumberOfTips' }, (error, result) => {
                // add a tip
                let totalTips = result.totalTips;

                db.collection('BBY_20_Tips').insertOne({
                    _id: totalTips + 1,
                    title: req.body.title,
                    description: req.body.description
                }, (error, result) => {
                    // increment the total number of tips
                    db.collection('BBY_20_Count').updateOne({ name: 'NumberOfTips' }, { $inc: { totalTips: 1 } }, (error, result) => {

                            res.redirect("/tips");
                        
                    });
                });
            });
        }
    });
});

// show edit tip page
router.get("/edit-tips/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const editTips = fs.readFileSync(directory.editTips);
        const editTipsHTML = new JSDOM(editTips);
        db.collection('BBY_20_Tips').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            editTipsHTML.window.document.getElementById("tipNumber").setAttribute("value", `${result._id}`);
            editTipsHTML.window.document.getElementById("tipTitle").setAttribute("value", `${result.title}`);
            editTipsHTML.window.document.getElementById("tipDescription").setAttribute("value", `${result.description}`);
            res.send(editTipsHTML.serialize());
        });
    }
});

// edit tip information
router.put("/tip-edit", (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Tips').updateOne({ _id: req.body._id }, {
        $set: {
            title: req.body.title,
            description: req.body.description
        }
    }, (error, result) => {
        res.redirect("/tips");
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;