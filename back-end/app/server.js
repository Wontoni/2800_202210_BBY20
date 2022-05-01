"use strict";
// port number
const PORT = 2800;
// express module
const express = require("express");
const app = express();
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
    res.sendFile(__dirname + "/index.html");
});

app.get("/landing", (req, res) => {
    res.sendFile(__dirname + "/landing.html");
});

app.get("/sign-up", (req, res) => {
    res.sendFile(__dirname + "/sign-up.html");
});

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/home.html");
})

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