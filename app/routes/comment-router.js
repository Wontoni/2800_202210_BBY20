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
// sanitize-html
const sanitizeHTML = require("sanitize-html");

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
// create a comment
router.post('/create-comment', (req, res) => {
    let sanitizedContents = sanitizeHTML(req.body.contents);
    let sanitizedPostID = sanitizeHTML(req.body.postID);

    if (req.user) {
        db.collection('BBY_20_Count').findOne({
            name: 'NumberOfComments'
        }, (error, result) => {
            if (!error) {
                db.collection('BBY_20_Comment').insertOne({
                    "commentID" : result.totalComment + 1,
                    "contents" : sanitizedContents,
                    "postID" : sanitizedPostID,
                    "timestamp" : new Date(),
                    "userID" : req.user._id,
                    "userName" : req.user.username,
                    "userAvatar" : req.user.avatar
                }, (error, result) => {
                    if (!error) {
                        db.collection('BBY_20_Count').updateOne({
                            name: 'NumberOfComments'
                        }, {
                            $inc: {
                                totalComment: 1
                            }
                        }, (error, result) => {
                            db.collection('BBY_20_Post').updateOne({
                                _id: parseInt(req.body.postID)
                            }, {
                                $inc: {
                                    totalComment: 1
                                }
                            }, (error, result) => {
                                if (result.acknowledged) {
                                    res.redirect("back");
                                }
                            });
                        });
                    }
                });
            }
        });
    } else {
        res.redirect("/login");
    }
});

// delete comment
router.delete("/delete-comment", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        db.collection("BBY_20_Comment").deleteOne({
            _id: parseInt(req.body.commentID)
        }, (error, result) => {
            db.collection("BBY_20_Post").updateOne({
                _id: parseInt(req.body.postID)
            }, {
                $inc: {
                    totalComment: -1
                }
            }, (error, result) => {
                res.send("Delete Success");
            });
        });
    }
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;