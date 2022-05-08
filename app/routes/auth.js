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
    console.log(req.body);
    res.redirect(`/main?username=${req.body.username}`);
});

// sign-out => redirect to landing page
router.get("/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;

function loginHTML(message) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
            <title>Login | Unified</title>
        
            <!-- Favicon -->
            <link rel="icon" type="image/png" href="/public/assets/logo/un-logo-mini.svg">
        
            <!-- Adobe Fonts (Obviously Wide + Nunito Sans) -->
            <link rel="stylesheet" href="https://use.typekit.net/xup5ffl.css">
        
            <!-- Custom CSS -->
            <link rel="stylesheet" href="/public/css/global.css">
            <link rel="stylesheet" href="/public/css/login.css">
        </head>
        
        <body>
        
            <div class="wrapper">
                <div class="login-section">
                    <div class="section-left">
                        <div class="container">
                            <div class="login-form">
                                <h2>Welcome back</h2>
                                <form action="/login-process" method="POST">
                                    <div class="form-group">
                                        <label for="username">Username</label>
                                        <input type="text" class="input" id="username" name="username"
                                            placeholder="Enter your username" required>
                                        <small id="usernameError" class="form-error">*Please check your username.</small>
                                    </div>
        
                                    <div class="form-group">
                                        <label for="userPassword">Password</label>
                                        <input type="password" class="input" id="userPassword" name="password"
                                            placeholder="Enter your password" required>
                                        <small id="userPasswordError" class="form-error">*Please check your password.</small>
                                    </div>
                                    <div>${message}</div>
                                    <button type="submit" class="primary-button">Login</button>
                                    <button type="submit" id="test" class="primary-button">LoginTest</button>
                                </form>
                                <p>Don't have an account yet? <a href="/sign-up" class="text-button">Sign Up Now</a></p>
                            </div>
                        </div>
                    </div>
        
                    <div class="section-right">
                        <img src="/public/assets/logo/un-logo-primary_white.svg" alt="Unified logo in white">
                    </div>
                </div>
            </div>
            <!-- Custom JS -->
            <script>
                document.querySelector("#test").addEventListener("click", () => {
                    fetch("/login-process", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            username: document.getElementsByName("username")[0].value,
                            password: document.getElementsByName("password")[0].value
                        })
                    }).then((res) => {
                        res.json();
                    }).then((res) => {
                        
                    });
                });
            </script>
            <script src="/public/js/skeleton.js"></script>
            <script src="/public/js/global.js"></script>
        </body>
        
        </html>
    `;
}