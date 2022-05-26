"use strict";
/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
// Router
const router = express.Router();
// path
const path = require("path");
// passport
const passport = require("passport");
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
// show login page
router.get("/login", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        res.redirect("/main");
    }
});

// login process
router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            res.json(err);
        }
        if (!user) {
            return res.json(info.message);
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            } else {
                res.redirect("/main");
            }
        });
    })(req, res, next);
});

// sign-out process
router.get("/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;