const express = require("express");
const path = require("path");

const indexRouter = express.Router();

// Home page
indexRouter.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/home.html"));
});

// Help page
indexRouter.get("/help", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/help.html"));
});

// Profile page
indexRouter.get("/profile/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/profile.html"));
})

// Handle undefined routes
indexRouter.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/error.html"))
})

module.exports = indexRouter;