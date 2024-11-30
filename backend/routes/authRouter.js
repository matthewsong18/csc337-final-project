const { Router } = require("express");
const { getUserByName, createUser} = require("../controllers/userController");
const path = require("path");
const authRouter = Router();

// Sign up a new user
authRouter.post("/signup/:username", createUser);

// Get login page
authRouter.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/auth.html"))
});

// Get into user profile
authRouter.get("/login/:username", getUserByName);

// Handle undefined routes
authRouter.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/error.html"))
})

module.exports = authRouter;