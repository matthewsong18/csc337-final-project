const { Router } = require("express");

const chatRouter = Router();

// Home page
chatRouter.get("/", (req, res) => {
    res.send("Home page");
});

// Join routes
chatRouter.get("/join", (req, res) => {
    res.send(`Join room page`);
});

chatRouter.get("/join/:chat_id", (req, res) => {
    res.send(`Join room: ${req.params.chat_id}`);
});

// Create route
chatRouter.get("/create", (req, res) => {
    // create a new chat and redirect user to that chat
    res.send(`Create room page`);
});

// Help route
chatRouter.get("/help", (req, res) => {
    res.send(`User help page`);
});

// Profile route
chatRouter.get("/profile/:username", (req, res) => {
    res.send(`Get profile of user: ${req.params.username}`);
})

module.exports = chatRouter;