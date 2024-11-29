const express = require("express");
const path = require("path");
const authRouter = express.Router();

// Sign up a new user
authRouter.post("/signup/:username", (req, res) => {
    // TO-DO
});

// Get login page
authRouter.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/auth.html"))
});

// Get into user profile
authRouter.get("/login/:username", (req, res) => {
    // TO-DO
});

// Handle undefined routes
authRouter.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/error.html"))
})

module.exports = authRouter;