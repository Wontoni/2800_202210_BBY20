"use strict";

// port number
const PORT = 2800;
// html files directory
const htmlDir = __dirname + "/views";
// express module
const express = require("express");
const app = express();
// set static files
app.use("/public", express.static("public"));
// body-parser module
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// mongoDB setting
const MongoClient = require("mongodb").MongoClient;
const URL = "mongodb+srv://bby20:unified20@cluster0.wphdm.mongodb.net/Unified?retryWrites=true&w=majority";
var db;
MongoClient.connect(URL, (error, client) => {
    if (error) {
        return console.log(error);
    } else {
        db = client.db("Unified");
        app.listen(PORT, () => {
            console.log("Server is operating on port 2800");
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(htmlDir + "/index.html");
});

app.get("/sign-up", (req, res) => {
    res.sendFile(htmlDir + "/sign-up.html");
});

app.post('/register', (req, res) => {
    db.collection('count').findOne({ name: 'NumberOfUsers' }, (error, result) => {
        // check if it is null
        if (!req.body.username || !req.body.password) {
            return res.redirect("/sign-up");
        }
        // set role
        let role = "regular";
        if (req.body.role) {
            role = "admin"
        }
        // add a user
        var totalUsers = result.totalUser;
        db.collection('user').insertOne({
            _id: totalUsers + 1,
            username: req.body.username,
            password: req.body.password,
            role: role
        }, (error, result) => {
            console.log('saved successfully');
            // increment the total number of admin users
            if (role == "admin") {
                db.collection('count').updateOne({ name: 'NumberOfAdmins' }, { $inc: { totalAdmin: 1 } });
            }
            // increment the total number of users
            db.collection('count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: 1 } }, (error, result) => {
                if (result.acknowledged) {
                    res.redirect("/");
                }
            });
        });
    });
});

app.get("/home", (req, res) => {
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
            <h1>List of Users</h1>
            <div id="user-list">
            ${list}
            </div>
            <script src="/public/js/admin.js"></script>
        </body>
        </html>`);
    });
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(session({
    secret: "secret code",
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.post("/sign-in", passport.authenticate("local", {
    failureRedirect: "/fail"
}), (req, res) => {
    res.redirect("/home");
});

app.get("/home", isSignedIn, (req, res) => {
    console.log(req.user);
    if (req.user.role === "admin") {
        res.sendFile(htmlDir + "/admin.html");
    } else if (req.user.role === "regular") {
        res.sendFile(htmlDir + "/home.html");
    }
});

function isSignedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.send("You are not signed in");
    }
};

app.get("/sign-out", (req, res) => {
    req.logout();
    res.redirect("/");
});

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