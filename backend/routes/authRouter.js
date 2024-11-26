const { Router } = require("express");
const { getUserByName, createUser } = require("../controllers/userController");

const authRouter = Router();

// Sign up a new user
authRouter.post("/signup/:username", createUser);

// Get login page
authRouter.get("/login", (req, res) => {
    res.send(`Login/Signup page`);
});

// Get into user profile
authRouter.get("/login/:username", getUserByName);

module.exports = authRouter;