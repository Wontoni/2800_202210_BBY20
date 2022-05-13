"use strict";

/* ------------------------------ Port ------------------------------ */
const PORT = 8000;
/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
const app = express();
// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
// security middleware
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
// session
const session = require("express-session");
app.use(session({
    secret: "BBY-20-Unified",
    resave: true,
    saveUninitialized: false
}));
// passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.username);
});
passport.deserializeUser((username, done) => {
    db.collection("BBY_20_User").findOne({
        username: username
    }, (error, result) => {
        done(null, result);
    });
});
// LocalStrategy
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    session: true,
    passReqToCallback: false
}, (inputUsername, inputPassword, done) => {
    db.collection("BBY_20_User").findOne({
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
// flash
const flash = require("connect-flash");
app.use(flash());

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

/* ------------------------------ Static Path ------------------------------ */
app.use("/public", express.static("public"));

/* ------------------------------ Routing ------------------------------ */
const indexRoute = require("./routes/index");
app.use("/", indexRoute);

const authRoute = require("./routes/auth");
app.use("/", authRoute);

const profileRoute = require("./routes/profile");
app.use("/", profileRoute);
app.use("/profile", profileRoute);

/* ------------------------------ Listen to Server ------------------------------ */
app.listen(PORT);

/* ------------------------------ Heroku Server Hosting ------------------------------ */
let http = require('http');
let url = require('url');

http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    console.log(q.query);

    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*"
    });

    res.end(`Hello ${q.query['name']}`);
}).listen(process.env.PORT || 8000);