const { Router } = require("express");

const authRouter = Router();

// Signup route
authRouter.post("/signup/:username", (req, res) => {
    res.send(`New user signs up: ${req.params.username}`);
});

// Login routes
authRouter.get("/login", (req, res) => {
    res.send(`Login page`);
});

authRouter.get("/login/:username", (req, res) => {
  res.send(`Username: ${req.params.username}`);
});

module.exports = authRouter;