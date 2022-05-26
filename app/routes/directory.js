"use strict";

const path = require("path");

const directory = {
    index: path.join(__dirname, "../public/html", "index.html"),
    main: path.join(__dirname, "../public/html", "main.html"),
    signup: path.join(__dirname, "../public/html", "sign-up.html"),
    login: path.join(__dirname, "../public/html", "login.html"),
    profile: path.join(__dirname, "../public/html", "profile.html"),
    admin: path.join(__dirname, "../public/html", "admin.html"),
    friend: path.join(__dirname, "../public/html", "friends.html"),
    editPost: path.join(__dirname, "../public/html", "edit-post.html"),
    post: path.join(__dirname, "../public/html", "create-post.html"),
    timeline: path.join(__dirname, "../public/html", "timeline.html"),
    friend: path.join(__dirname, "../public/html", "friends.html"),
    easter: path.join(__dirname, "../public/html", "easter.html"),
    editUser: path.join(__dirname, "../public/html", "edit-user.html"),
    tips: path.join(__dirname, "../public/html", "admin_tips.html"),
    editTips: path.join(__dirname, "../public/html", "edit-tips.html"),
    upload: path.join(__dirname, "../public/assets/upload/"),
    singlePost: path.join(__dirname, "../public/html", "single-post.html"),
};

module.exports = directory;