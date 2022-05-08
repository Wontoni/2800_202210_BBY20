"use strict";
/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
// Router
const router = express.Router();
// path
const path = require("path");
// session
const session = require("express-session");
router.use(session({
    secret: "BBY-20-Unified",
    resave: true,
    saveUninitialized: false
}));
// html templates
var regularTemplate = require('../public/templates/regular');
var adminTemplate = require('../public/templates/admin');
var loginTemplate = require('../public/templates/login');
// flash
const flash = require("connect-flash");
router.use(flash());
// passport
const passport = require("passport");
const { Template } = require("ejs");
router.use(passport.initialize());
router.use(passport.session());
// LocalStrategy
const LocalStrategy = require("passport-local").Strategy;

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

/* ------------------------- Auth Strategy ------------------------- */
passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    session: true,
    passReqToCallback: false
}, (inputUsername, inputPassword, done) => {
    db.collection("user").findOne({
        username: inputUsername
    }, (error, result) => {
        if (error) {
            return done(error);
        }
        if (!result) {
            return done(null, false, {
                message: "Incorrect username"
            });
        }
        if (inputPassword == result.password) {
            return done(null, result);
        } else {
            return done(null, false, {
                message: "Incorrect password"
            });
        }
    })
}));

/* ------------------------- Session Data ------------------------- */
passport.serializeUser((user, done) => {
    done(null, user.username);
});
passport.deserializeUser((username, done) => {
    db.collection("user").findOne({
        username: username
    }, (error, result) => {
        done(null, result);
    });
});

/* ------------------------------ File Directories ------------------------------ */
const directory = {
    main: path.join(__dirname, "../public/html", "main.html"),
    admin: path.join(__dirname, "../public/html", "admin.html"),
    login: path.join(__dirname, "../public/html", "login.html")
};

/* ------------------------------ Middleware Function ------------------------------ */
function isSignedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect("/");
    }
};

/* ------------------------------ Routers ------------------------------ */
// sign-in => redirect by users' role

router.get("/main", isSignedIn, (req, res) => {
    // if user.role is admin, show admin.html
    if (req.user.role === "admin") {
        db.collection("user").find().toArray((error, result) => {
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

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;