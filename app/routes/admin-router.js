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
const { resourceLimits } = require("worker_threads");

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
// delete a user
router.delete('/delete', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_User').findOne({ _id: req.body._id }, (error, result) => {
        if (result.role === "admin") {
            db.collection('BBY_20_Count').findOne({ name: 'NumberOfAdmins' }, (error, result) => {
                if (result.totalAdmin === 1) {  // if there is only one admin, not allowed to delete
                    // Popup saying can't delete last admin user
                } else {
                    db.collection('BBY_20_User').deleteOne(req.body, (error, result) => {
                        // decrement the total number of admin users
                        db.collection('BBY_20_Count').updateOne({ name: 'NumberOfAdmins' }, { $inc: { totalAdmin: -1 } }, (error, result) => {
                            res.sendFile(directory.main);
                        });
                    });
                }
            });
        } else if (result.role === "regular") {
            db.collection('BBY_20_User').deleteOne(req.body, (error, result) => {
                db.collection('BBY_20_Post').deleteMany({ userID: parseInt(req.body._id) }, (error, result) => {
                    res.sendFile(directory.main);
                });
            });
        }
    });
});

// create a user
router.post('/create', (req, res) => {
    db.collection("BBY_20_User").findOne({
        username: req.body.username
    }, (error, result) => {
        let exist = false;
        if (result) {
            exist = true;
        }

        if (exist) {
            res.json({
                message: "This username already exists"
            });
        } else {
            db.collection('BBY_20_Count').findOne({ name: 'NumberOfUsers' }, (error, result) => {
                // add a user
                let totalUsers = result.totalUser;
                const defaultSchool = "";
                const defaultAvatarURL = "public/assets/upload/default-avatar.png";
                const defaultRole = "regular";
                db.collection('BBY_20_User').insertOne({
                    _id: totalUsers + 1,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    school: defaultSchool,
                    avatar: defaultAvatarURL,
                    role: defaultRole
                }, (error, result) => {
                    // increment the total number of users
                    db.collection('BBY_20_Count').updateOne({ name: 'NumberOfUsers' }, { $inc: { totalUser: 1 } }, (error, result) => {
                        if (result.acknowledged) {
                            res.redirect("/main");
                        }
                    });
                });
            });
        }
    });
});

// show edit page
router.get("/edit-user/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const edit = fs.readFileSync(directory.editUser);
        const editHTML = new JSDOM(edit);
        db.collection('BBY_20_User').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            editHTML.window.document.getElementById("userNumber").setAttribute("value", `${result._id}`);
            editHTML.window.document.getElementById("userName").setAttribute("value", `${result.username}`);
            editHTML.window.document.getElementById("userEmail").setAttribute("value", `${result.email}`);
            editHTML.window.document.getElementById("userPassword").setAttribute("value", `${result.password}`);
            editHTML.window.document.getElementById("userSchool").setAttribute("value", `${result.school}`);
            res.send(editHTML.serialize());
        });
    }
});

// edit user information
router.put("/user-edit", (req, res) => {
    const userID = parseInt(req.body._id);

    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        db.collection("BBY_20_User").findOne({
            username: req.body.username
        }, (error, result) => {
            let exist = false;
            if (result) {
                exist = true;
            }

                if (exist) {
                    res.json({
                        message: "This username already exists"
                    });
                } else {
                    db.collection('BBY_20_User').updateOne({ _id: userID }, {
                        $set: {
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password,
                            school: req.body.school
                        }
                    }, (error, result) => {
                        db.collection('BBY_20_Post').updateMany({ userID: userID }, {
                            $set: {
                                username : req.body.username
                            }
                        }, (error, result) => {
                            db.collection("BBY_20_Comment").updateOne({
                                userID : userID
                            }, {
                                $set : {
                                    userName : req.body.username
                                }
                            }, (error, result) => {
                                res.send("Update Success");
                            });
                        });
                    });
                }
        });
    }
});

// Show requests page
router.get("/requests", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const request = fs.readFileSync(directory.adminRequests);
        const requestProfHTML = new JSDOM(request);

        var requestsTemplate = requestProfHTML.window.document.getElementById("requestsTemplate");
        var listTemplate = requestProfHTML.window.document.getElementById("listTemplate");
        db.collection("BBY_20_Requests").find().sort({ lastModified: -1 }).toArray((error, result) => {
            if (result.length === 0) {
                requestsTemplate.remove();
            } else {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var name = result[i].name;
                    var school = result[i].school;

                    var requestsInfo = requestsTemplate.cloneNode(true);
                    requestsTemplate.remove();
                    requestsInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                    requestsInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                    requestsInfo.querySelector("#title").innerHTML = name;
                    requestsInfo.querySelector("#description").innerHTML = school;

                    listTemplate.appendChild(requestsInfo);
                }
            }
            requestProfHTML.window.document.getElementById("total-requests").innerHTML = result.length + " Requests";
            res.send(requestProfHTML.serialize());
        });

    }
});

// delete a requests
router.delete('/delete-request', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Requests').findOne({ _id: req.body._id }, (error, result) => {
        db.collection('BBY_20_Requests').deleteOne(req.body, (error, result) => {
            res.sendFile(directory.adminRequests);
        });
    });
});

// accept a request
router.put('/check-requests', (req, res) => {
    req.body._id = parseInt(req.body._id);
    var totalProfs = 0;
    db.collection('BBY_20_Requests').findOne({ _id: req.body._id }, (error, result) => {
        var nameF = result.name;
        var schools = result.school;

        db.collection('BBY_20_Count').findOne({ name: "NumberOfProfessors" }, (error, result) => {
            totalProfs = result.totalProfessors;

            db.collection('BBY_20_Professors').insertOne({
                _id: totalProfs + 1,
                name: nameF,
                school: schools,
                stars: 0,
                totalReviews: 0
            }, (error, result) => {

                // increment the total number of professors
                db.collection('BBY_20_Count').updateOne({ name: 'NumberOfProfessors' }, { $inc: { totalProfessors: 1 } }, (error, result) => {
                    if (result.acknowledged) {
                        var requestNo = req.body._id
                        db.collection('BBY_20_Requests').findOne({ _id: requestNo }, (error, result) => {
                            db.collection('BBY_20_Requests').deleteOne(result, (error, result) => {
                                res.sendFile(directory.adminRequests);
                            });
                        })
                    }
                });
            });
        })
    }

    );
});

// delete a requests
router.get('/check-requests', (req, res) => {
    res.redirect("/requests");
});

// Show professors page
router.get("/professors", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const professors = fs.readFileSync(directory.adminProfessors);
        const professorsProfHTML = new JSDOM(professors);

        var professorsTemplate = professorsProfHTML.window.document.getElementById("professorsTemplate");
        var listTemplate = professorsProfHTML.window.document.getElementById("listTemplate");
        db.collection("BBY_20_Professors").find().sort({ lastModified: -1 }).toArray((error, result) => {
            if (result.length === 0) {
                professorsTemplate.remove();
            } else {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var name = result[i].name;
                    var school = result[i].school;

                    var professorsInfo = professorsTemplate.cloneNode(true);
                    professorsTemplate.remove();
                    professorsInfo.querySelector("#delete-number").setAttribute("data-number", `${number}`);
                    professorsInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                    professorsInfo.querySelector("#title").innerHTML = name;
                    professorsInfo.querySelector("#description").innerHTML = school;

                    listTemplate.appendChild(professorsInfo);
                }
            }
            professorsProfHTML.window.document.getElementById("total-professors").innerHTML = result.length + " Professors";
            res.send(professorsProfHTML.serialize());
        });

    }
});

// delete a professor
router.delete('/delete-professor', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Professors').findOne({ _id: req.body._id }, (error, result) => {
        db.collection('BBY_20_Professors').deleteOne(req.body, (error, result) => {
            db.collection('BBY_20_Review').deleteMany({ profID: parseInt(req.body._id) }, (error, result) => {
                res.sendFile(directory.adminProfessors);
            });
        });
    });
});


// show edit page
router.get("/edit-professor/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const editProf = fs.readFileSync(directory.editProfessor);
        const editProfHTML = new JSDOM(editProf);
        db.collection('BBY_20_Professors').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            editProfHTML.window.document.getElementById("profNumber").setAttribute("value", `${result._id}`);
            editProfHTML.window.document.getElementById("profName").setAttribute("value", `${result.name}`);
            editProfHTML.window.document.getElementById("profSchool").setAttribute("value", `${result.school}`);

            res.send(editProfHTML.serialize());
        });
    }
});

// edit user information
router.put("/professor-edit", (req, res) => {
    req.body._id = parseInt(req.body._id);
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        db.collection('BBY_20_Professors').updateOne({ _id: req.body._id }, {
            $set: {
                name: req.body.name,
                school: req.body.school
            }
        }, (error, result) => {
            res.redirect("/professors");
        });
    }
});

// create a user
router.post('/create-professor', (req, res) => {
    db.collection('BBY_20_Count').findOne({ name: 'NumberOfProfessors' }, (error, result) => {
        // add a user
        let totalProfessors = result.totalProfessors;

        db.collection('BBY_20_Professors').insertOne({
            _id: totalProfessors + 1,
            name: req.body.name,
            school: req.body.school,
            stars: 0,
            totalReviews: 0
        }, (error, result) => {
            // increment the total number of users
            db.collection('BBY_20_Count').updateOne({ name: 'NumberOfProfessors' }, { $inc: { totalProfessors: 1 } }, (error, result) => {
                if (result.acknowledged) {
                    res.redirect("/professors");
                }
            });
        });
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;