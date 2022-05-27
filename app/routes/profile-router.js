"use strict";

/* ------------------------------ Module ------------------------------ */
// express
const express = require("express");
// Router
const router = express.Router();
// path
const path = require("path");
// fs
const fs = require("fs");
// JSDOM
const { JSDOM } = require("jsdom");
// directory
const directory = require("./directory");
// multer
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets/upload/");
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        cb(null, req.user._id + "_" + req.user.username + ext);
    }
});
const upload = multer({
    storage: storage
});
// sanitize-html
const sanitizeHTML = require("sanitize-html");

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

/* ------------------------------ Routers ------------------------------ */
// show profile page
router.get("/profile", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const profile = fs.readFileSync(directory.profile);
        const profileHTML = new JSDOM(profile);
        profileHTML.window.document.getElementById("avatar").setAttribute("src", `${req.user.avatar}`);
        profileHTML.window.document.getElementById("userAvatar").setAttribute("src", `${req.user.avatar}`);
        profileHTML.window.document.getElementById("username").setAttribute("value", `${req.user.username}`);
        profileHTML.window.document.getElementById("userEmail").setAttribute("value", `${req.user.email}`);
        profileHTML.window.document.getElementById("userPassword").setAttribute("value", `${req.user.password}`);
        profileHTML.window.document.getElementById("userSchool").setAttribute("value", `${req.user.school}`);
        res.send(profileHTML.serialize());
    }
});

// update avatar
router.post("/upload-process", upload.single("avatar"), (req, res) => {
    if (req.user) {
        db.collection("BBY_20_User").updateOne({
            _id: req.user._id
        }, {
            $set: {
                avatar: req.file.destination + req.file.filename
            }
        }, (error, result) => {
            db.collection("BBY_20_Post").updateOne({
                userID : req.user._id
            }, {
                $set : {
                    userAvatar : req.file.destination + req.file.filename
                }
            }, (error, result) => {
                db.collection("BBY_20_Comment").updateOne({
                    userID : req.user._id
                }, {
                    $set : {
                        userAvatar : req.file.destination + req.file.filename
                    }
                }, (error, result) => {
                    res.redirect("/profile");
                });
            })
        })
    }
});

// update user profile
router.put("/profile-edit", (req, res) => {
    let sanitizedUsername = sanitizeHTML(req.body.username);
    let sanitizedEmail = sanitizeHTML(req.body.email);
    let sanitizedPassword = sanitizeHTML(req.body.password);
    let sanitizedSchool = sanitizeHTML(req.body.school);

    if (req.user) {
        db.collection("BBY_20_User").findOne({
            username: req.body.username
        }, (error, result) => {
            let exist = false;
            if (result) {
                exist = true;
            }

            if (exist && (req.user.username !== req.body.username)) {
                res.json({
                    message: "This username already exists"
                });
            } else {
                db.collection("BBY_20_User").updateOne({
                    _id: req.user._id
                }, {
                    $set: {
                        username: sanitizedUsername,
                        email: sanitizedEmail,
                        password: sanitizedPassword,
                        school: sanitizedSchool
                    }
                }, (error, result) => {
                    db.collection('BBY_20_Post').updateMany({ userID: req.user._id }, {
                        $set: {
                            username: sanitizedUsername
                        }
                    }, (error, result) => {
                        res.redirect("/profile");
                    });
                });
            }
        });
    }
});

// show review page
router.get("/reviews", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const review = fs.readFileSync(directory.review);
        const reviewHTML = new JSDOM(review);
        reviewHTML.window.document.getElementById("userAvatar").setAttribute("src", `${req.user.avatar}`);

        var profList = reviewHTML.window.document.getElementById("profList");
        var profTemplate = reviewHTML.window.document.getElementById("profTemplate");

        var maxScoreSpan = reviewHTML.window.document.createElement("span");
        var maxScoreText = reviewHTML.window.document.createTextNode(" / 5");
        maxScoreSpan.appendChild(maxScoreText);

        db.collection("BBY_20_Professors").find().sort({ lastModified: -1 }).toArray((error, result) => {
            if (result.length === 0) {
                profTemplate.remove();
            } else {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var name = result[i].name;
                    var school = result[i].school;
                    var stars = result[i].stars;
                    var total = result[i].totalReviews;
                    var finalScore = 0;
                    if (total != 0) {
                        finalScore = stars / total;
                        finalScore = finalScore.toFixed(1);
                    }
                    var profInfo = profTemplate.cloneNode(true);
                    profTemplate.remove();

                    profInfo.querySelector("#moreReviews").setAttribute("data-number", `${number}`); // View professor reviews number
                    profInfo.querySelector("#stars").innerHTML = finalScore + "<span> / 5</span>";
                    profInfo.querySelector("#moreReviews").innerHTML = "See " + total + " reviews";
                    profInfo.querySelector("#profName").innerHTML = name;

                    profList.appendChild(profInfo);
                }
            }
            res.send(reviewHTML.serialize());
        })

    }
});

// show single-reviews page
router.get("/single-review/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const singleReview = fs.readFileSync(directory.single_review);
        const singleReviewHTML = new JSDOM(singleReview);
        singleReviewHTML.window.document.getElementById("userAvatar").setAttribute("src", `/${req.user.avatar}`);

        var reviewList = singleReviewHTML.window.document.getElementById("reviewList");
        var reviewTemplate = singleReviewHTML.window.document.getElementById("reviewTemplate");
        db.collection('BBY_20_Professors').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            if (result.totalReviews != 0) {
                singleReviewHTML.window.document.getElementById("profScore").innerHTML = (result.stars / result.totalReviews).toFixed(1) + "<span> / 5</span>";
            } else {
                singleReviewHTML.window.document.getElementById("profScore").innerHTML = 0 + "<span> / 5</span>";
            }
            singleReviewHTML.window.document.getElementById("profName").innerHTML = result.name;
            singleReviewHTML.window.document.getElementById("reviewNumber").innerHTML = result.totalReviews;
            singleReviewHTML.window.document.getElementById("writeReviewBtn").setAttribute("data-number", result._id);


            db.collection("BBY_20_Review").find({ profID: parseInt(req.params.id) }).sort({ lastModified: -1 }).toArray((error, resultTwo) => {
                if (resultTwo.length === 0) {
                    reviewTemplate.remove();
                } else {
                    for (var i = 0; i < resultTwo.length; i++) {
                        var number = resultTwo[i]._id;
                        var score = resultTwo[i].stars;
                        var description = resultTwo[i].description;
                        var reviewClass = resultTwo[i].class;
                        var reviewInfo = reviewTemplate.cloneNode(true);
                        reviewTemplate.remove();

                        reviewInfo.querySelector("#singleScore").innerHTML = score;
                        reviewInfo.querySelector("#reviewDescription").innerHTML = description;
                        reviewInfo.querySelector("#reviewClass").innerHTML = reviewClass;
                        reviewList.appendChild(reviewInfo);
                    }
                }
                res.send(singleReviewHTML.serialize());
            });

        });

    }
});

// show create-review page
router.get("/create-review/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const createReview = fs.readFileSync(directory.create_review);
        const createReviewHTML = new JSDOM(createReview);
        createReviewHTML.window.document.getElementById("userAvatar").setAttribute("src", `/${req.user.avatar}`);

        db.collection('BBY_20_Professors').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            createReviewHTML.window.document.getElementById("profName").innerHTML = result.name;
            createReviewHTML.window.document.getElementById("profNumber").value = parseInt(req.params.id);
            res.send(createReviewHTML.serialize());
        });

    }
});

// create new review
router.post('/new-review', (req, res) => {
    req.body.profID = parseInt(req.body.profID);
    db.collection('BBY_20_Count').findOne({ name: 'NumberOfReviews' }, (error, result) => {
        if (!error) {
            var totalReview = result.totalReviews;
            db.collection('BBY_20_Review').insertOne({
                _id: totalReview + 1,
                class: req.body.className,
                profID: parseInt(req.body.profNumber),
                stars: parseInt(req.body.scoreNum),
                description: req.body.review
            }, (error, result) => {
                if (!error) {
                    db.collection('BBY_20_Count').updateOne({
                        name: 'NumberOfReviews'
                    }, {
                        $inc: { totalReviews: 1 }
                    }, (error, result) => {
                        if (result.acknowledged) {

                            // Add up reviews together
                            db.collection("BBY_20_Review").find({ profID: parseInt(req.body.profNumber) }).sort({ lastModified: -1 }).toArray((error, resultThree) => {
                                var totalScore = 0;
                                for (let i = 0; i < resultThree.length; i++) {
                                    totalScore += resultThree[i].stars;
                                }

                                db.collection('BBY_20_Professors').updateOne({
                                    _id: parseInt(req.body.profNumber)
                                }, {
                                    $inc: { totalReviews: 1 },
                                    $set: { stars: totalScore }
                                }, (error, result) => {
                                    if (result.acknowledged) {
                                        res.redirect("/reviews")
                                    }
                                });
                            }
                            )
                        }
                    });
                }
            });
        }
    });
});

// show professor request page
router.get("/request-professor", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const request = fs.readFileSync(directory.requestProf);
        const requestProfHTML = new JSDOM(request);
        requestProfHTML.window.document.getElementById("userAvatar").setAttribute("src", `/${req.user.avatar}`);

        res.send(requestProfHTML.serialize());

    }
});

// send request for professor
router.post("/send-request", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        db.collection('BBY_20_Count').findOne({ name: 'NumberOfRequests' }, (error, result) => {
            if (!error) {
                var totalRequests = result.totalRequests;
                db.collection('BBY_20_Requests').insertOne({
                    _id: totalRequests + 1,
                    type: "professor",
                    name: req.body.name,
                    school: req.body.school,
                })
            }

            db.collection('BBY_20_Count').updateOne({
                name: 'NumberOfRequests'
            }, {
                $inc: { totalRequests: 1 }
            }, (error, result) => {
                if (result.acknowledged) {
                    res.redirect("/reviews");
                }
            })
        })
    }

});


/* ------------------------------ Export Module ------------------------------ */
module.exports = router;