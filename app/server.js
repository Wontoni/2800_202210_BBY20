"use strict";

/* ------------------------------ Port ------------------------------ */
const PORT = 2800;
/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
const app = express();
// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// security code
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

/* ------------------------------ Static Path ------------------------------ */
app.use("/public", express.static("public"));

/* ------------------------------ Routing ------------------------------ */
const indexRoute = require("./routes/index");
app.use("/", indexRoute);

const authRoute = require("./routes/auth");
app.use("/", authRoute);

/* ------------------------------ Listen to Server ------------------------------ */
app.listen(PORT, () => {
    console.log("Server is operating on port 2800");
});