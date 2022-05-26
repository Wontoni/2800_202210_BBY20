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
// show planner page
router.get("/planner", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    } else {
        const planner = fs.readFileSync(directory.planner);
        const plannerHTML = new JSDOM(planner);
        
        var taskList = plannerHTML.window.document.getElementById("taskList");
        var taskTemplate = plannerHTML.window.document.getElementById("taskTemplate");
        
        db.collection("BBY_20_Tasks").find({userID: req.user._id }).toArray((error, result) => {
            if (result.length === 0) {
                taskTemplate.remove();
            } else {
                for (var i = 0; i < result.length; i++) {
                    var number = result[i]._id;
                    var user = result[i].userID;
                    var title = result[i].title;
                    var description = result[i].description;
                    var date = result[i].date;
                    var startTime = result[i].startTime;
                    var endTime = result[i].endTime;
                    var taskInfo = taskTemplate.cloneNode(true);
                    taskTemplate.remove();

                    var today = new Date();

                    if (date === today.toISOString().split('T')[0]) {
                        taskInfo.querySelector("#edit-number").setAttribute("data-number", `${number}`);
                        taskInfo.querySelector("#startTime").innerHTML = startTime;
                        taskInfo.querySelector("#endTime").innerHTML = endTime;
                        taskInfo.querySelector("#title").innerHTML = title;
                        taskInfo.querySelector("#description").innerHTML = description;
                        
                        taskList.appendChild(taskInfo);
                    }
                }
            }
            
            res.send(plannerHTML.serialize());
        })
    }
});

// show create-task page
router.get("/create-task", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const task = fs.readFileSync(directory.task);
        const taskHTML = new JSDOM(task);

        res.send(taskHTML.serialize());
    }
});

// show edit-task page
router.get("/edit-task/:id", (req, res) => {
    if (!req.user) {
        res.sendFile(directory.login);
    } else {
        const editTask = fs.readFileSync(directory.editTask);
        const editTaskHTML = new JSDOM(editTask);
        
        db.collection('BBY_20_Tasks').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
            editTaskHTML.window.document.getElementById("taskNumber").setAttribute("value", `${result._id}`);
            editTaskHTML.window.document.getElementById("taskTitle").setAttribute("value", `${result.title}`);
            editTaskHTML.window.document.getElementById("taskDesc").setAttribute("value", `${result.description}`);
            editTaskHTML.window.document.getElementById("taskDate").setAttribute("value", `${result.date}`);
            editTaskHTML.window.document.getElementById("taskStart").setAttribute("value", `${result.startTime}`);
            editTaskHTML.window.document.getElementById("taskEnd").setAttribute("value", `${result.endTime}`);

            res.send(editTaskHTML.serialize());
        });
    }
});

// create a task
router.post('/new-task', (req, res) => {
    db.collection('BBY_20_Count').findOne({ name: 'NumberOfTasks' }, (error, result) => {
        if (!error) {
            let totalTasks = result.totalTasks;
            db.collection('BBY_20_Tasks').insertOne({
                _id: totalTasks + 1,
                userID: req.user._id,
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                lastModified: new Date()
            }, (error, result) => {
                if (!error) {
                    db.collection('BBY_20_Count').updateOne({
                        name: 'NumberOfTasks'
                    }, {
                        $inc: { totalTasks: 1 }
                    }, (error, result) => {
                        if (result.acknowledged) {
                            res.redirect("/planner");
                        }
                    });
                }
            });
        }
    });
});

// edit task information
router.put("/task-edit", (req, res) => {
    req.body._id = parseInt(req.body._id);

    db.collection('BBY_20_Tasks').updateOne({ _id: req.body._id }, {
        $set: {
            userID: req.user._id,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            lastModified: new Date()
        }
    }, (error, result) => {
        console.log("worked");
        res.redirect("/planner");
    });
});

// delete a tip
router.delete('/delete-task', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection('BBY_20_Tasks').findOne({ _id: req.body._id }, (error, result) => {

        db.collection('BBY_20_Count').findOne({ name: 'NumberOfTasks' }, (error, result) => {

            db.collection('BBY_20_Tasks').deleteOne(req.body, (error, result) => {
                // decrement the total number of tips
                db.collection('BBY_20_Count').updateOne({ name: 'NumberOfTasks' }, { $inc: { totalTasks: -1 } }, (error, result) => {
                    res.sendFile(directory.planner);
                });
            });

        });
    });
});

/* ------------------------------ Export Module ------------------------------ */
module.exports = router;