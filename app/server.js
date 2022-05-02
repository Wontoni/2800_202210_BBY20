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
var db;
MongoClient.connect("mongodb+srv://bby20:unified20@cluster0.wphdm.mongodb.net/Unified?retryWrites=true&w=majority", (error, client) => {
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

app.get("/home", (req, res) => {
    res.sendFile(htmlDir + "/home.html");
});

app.post("/register", (req, res) => {
    db.collection("user").insertOne({
        username: req.body.username,
        password: req.body.password
    }, (error, result) => {
        if (result.acknowledged) {
            res.redirect("/");
        }
    });
});

app.get("/admin", (req, res) => {
    db.collection("user").find().toArray((error, result) => {
        console.log(result);
        res.json({
            users: result
        });
    });
});