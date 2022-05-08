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
// flash
const flash = require("connect-flash");
router.use(flash());
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
            let next = "<br><br>";
            let button = "&nbsp<button>EDIT</button>";
            let list = "";
            for (var i = 0; i < result.length; i++) {
                list += JSON.stringify(result[i]) + button + next;
            }
            // admin.html code goes here
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
                    <a href="/sign-out"><button id="sign-out">Sign Out</button></a>
                    <h3>List of Users</h3>
                    <div id="user-list">
                    ${list}
                    </div>
                    <script src="/public/js/admin.js"></script>
                </body>
                </html>
            `);
        });
        // if user.role is regular, show main.html
    } else if (req.user.role === "regular") {
        let name = "";
        name = req.user.username;
        res.send(`
        <!DOCTYPE html>
        <html lang="en">

        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unified</title>
        <link rel="stylesheet" href="../public/css/mainpage.css">

        <!-- Fonts (Obviously Wide + Nunito Sans) -->
        <link rel="stylesheet" href="https://use.typekit.net/xup5ffl.css ">

        <!-- JQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <!-- Google Icons -->
        <link rel="stylesheet"
            href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" />
        </head>

        <body>
        <div class="userContainer">
            <div class="userNav">
                <!-- Logo -->
                <div id="logo">
                    <img src="../public/assets/logo/un-logo-mini_white.svg" alt="Unified logo in white">
                </div>

                <!-- Search Bar -->
                <div class="searchForm">
                    <form>
                        <input class="searchIcon" type="text" name="search" placeholder="Search">
                    </form>
                </div>

                <div class="icons">
                    <button class="postBtn">Create</button> 
                    <button class="tipsBtn">Tips</button>
                    <button class="scheduleBtn">Schedule</button>
                    <button class="homeBtn">Home</button>
                </div>

                <!-- Profile Picture -->
                <div id="dropdown">
                        ${name}
                        <img id="profilePic" src="../public/assets/homepage/kindpng_214439.png" alt="Default Profile Picture">
                        <div class="userProfileName">
                            <button id="sign-out">Log Out</button>
                        </div>
                    <div class="dropdownProfile">
                        <a href="#profilePage">Profile</a>
                        <a href="#settings">Settings</a>
                        <a href="/sign-out">Log Out</a>
                    </div>
                </div>
            </div>

            <div class="userContent">
                <!-- Threads will be placed into here -->
                <div class="cardPlaceholder"></div>

                <div class="noPosts">
                    Oh no! Looks like there are no posts! Be the first to post a thread! (Not yet available)
                </div>
            </div>
            <div class="userFooter">
                BBY20
            </div>
        </div>

        </div>
        <button id="sign-out">Sign Out</button> -->
        <script src="../public/js/mainpage.js"></script>
        <script src="/public/js/user.js"></script> -->

        <!-- Jquery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        </body>

        </html>
        `)
    }
});

// show login page
router.get("/login", (req, res, next) => {
    // middleware => logged in user cannot access login page
    if (!req.user) {
        next();
    } else {
        res.redirect("/main");
    }
}, (req, res) => {
    res.sendFile(directory.login);
});

//authenticate
router.post("/login-process", passport.authenticate("local", {
    failureRedirect: "/login"
}), (req, res) => {
    res.redirect("/main");
});

// sign-out => redirect to landing page
router.get("/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;