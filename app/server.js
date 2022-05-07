"use strict";

/* ------------------------------ Port ------------------------------ */
const PORT = 8000;
/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
const app = express();
// body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

/* ------------------------------ Static Path ------------------------------ */
app.use("/public", express.static("public"));

/* ------------------------------ Routing ------------------------------ */
const indexRoute = require("./routes/index");
app.use("/", indexRoute);

const authRoute = require("./routes/auth");
app.use("/", authRoute);

/* ------------------------------ Listen to Server ------------------------------ */
app.listen(PORT, () => {
    console.log("Server is operating on port " + PORT);
});