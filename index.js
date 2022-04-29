const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');

// static path mappings
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./public/html"));

app.use(session(
    {
        secret: "noonewilleverguessthissecretphrasehtmltftrankistrash",
        name: "wazaSessionID",
        resave: false,
        // create a unique identifier for that client
        saveUninitialized: true
    })
);

app.get("/", function (req, res) {

    let index = fs.readFileSync("./app/html/index.html", "utf8");
    let indexDOM = new JSDOM(index);

    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(indexDOM.serialize());
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    console.log("What was sent", req.body.email, req.body.password);

    // Authenticate user with DB here
    if (true) {
        req.session.save(function (err) {
            // session saved. For analytics, we could record this in a DB
        });
        // User logged in
        res.send({ status: "success", msg: "Logged in." });
    } else {
        // User not found in DB
        res.send({ status: "fail", msg: "User account not found." });
    }
});

app.get("/logout", function (req, res) {

    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                // session deleted, redirect to home
                res.redirect("/");
            }
        });
    }
});


// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Listening on port " + port + "!");
});
