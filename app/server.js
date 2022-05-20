"use strict";

/* ------------------------------ Port ------------------------------ */
const PORT = 8080;
/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
const app = express();
// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true,
    limit : "50mb"
}));
// method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
// security middleware
app.use((req, res, next) => {
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
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    db.collection("BBY_20_User").findOne({
        _id: _id
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
// path
const path = require("path");
// tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


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
const indexRouter = require("./routes/index-router");
app.use("/", indexRouter);

const authRouter = require("./routes/auth-router");
app.use("/", authRouter);

const profileRouter = require("./routes/profile-router");
app.use("/", profileRouter);

const signupRouter = require("./routes/signup-router");
app.use("/", signupRouter);

const adminRouter = require("./routes/admin-router");
app.use("/", adminRouter);

const mainRouter = require("./routes/main-router");
app.use("/", mainRouter);

/* ------------------------------ Listen to Server ------------------------------ */
app.listen(PORT);
