const { Router } = require("express");

const indexRouter = Router();

// Home page
indexRouter.get("/", (req, res) => {
    res.send("Home page");
});

// Help page
indexRouter.get("/help", (req, res) => {
    res.send(`User help page`);
});

// Profile page
indexRouter.get("/profile/:username", (req, res) => {
    res.send(`Get profile of user: ${req.params.username}`);
})

module.exports = indexRouter;