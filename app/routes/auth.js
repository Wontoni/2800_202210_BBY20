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
// passport
const passport = require("passport");
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
                message: "Username doesn't exist"
            });
        }
        if (inputPassword == result.password) {
            return done(null, result);
        } else {
            return done(null, false, { message: "Password is incorrect" });
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
    home: path.join(__dirname, "../views", "home.html"),
    admin: path.join(__dirname, "../views", "admin.html")
};

/* ------------------------------ Middleware Function ------------------------------ */
function isSignedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.send("You are not signed in");
    }
};

/* ------------------------------ Routers ------------------------------ */
// sign-in => redirect by users' role
router.get("/home", isSignedIn, (req, res) => {
    if (req.user.role === "admin") {
        db.collection("user").find().toArray((error, result) => {
            let next = "<br><br>";
            let button = "&nbsp<button>EDIT</button>";
            let list = "";
            for (var i = 0; i < result.length; i++) {
                list += JSON.stringify(result[i]) + button + next;
            }
            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Unified</title>
            </head>
            <body>
                <h1>Admin Dashboard</h1>
                <h3>List of Users</h3>
                <div id="user-list">
                ${list}
                </div>
                <script src="/public/js/admin.js"></script>
            </body>
            </html>`);
        });
    } else if (req.user.role === "regular") {
        res.sendFile(directory.home);
    }
});

// sign-in => authenticate 
router.post("/sign-in", passport.authenticate("local", {
    failureRedirect: "/fail"
}), (req, res) => {
    res.redirect("/home");
});

// sign-out => redirect to landing page
router.get("/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;