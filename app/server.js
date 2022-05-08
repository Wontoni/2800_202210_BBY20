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
app.db = db;

/* ------------------------------ Static Path ------------------------------ */
app.use("/public", express.static("public"));

/* ------------------------------ Routing ------------------------------ */
const indexRoute = require("./routes/index");
app.use("/", indexRoute);

const authRoute = require("./routes/auth");
app.use("/", authRoute);

/* ------------------------------ Listen to Server ------------------------------ */
app.listen(PORT, () => {
    console.log("Server is operating on port 8000");
});