const { Router } = require("express");

const chatRouter = Router();

// Get a chat
chatRouter.get("/:chat_id", (req, res) => {
    res.send(`Chat ID: ${req.params.chat_id}`);
});

// Get a poll
chatRouter.get("/:chat_id/:poll_id", (req, res) => {
    res.send(`Poll ID: ${req.params.poll_id}`);
});

// Join page
chatRouter.get("/join", (req, res) => {
    res.send(`Join room page`);
});

// Join a chat
chatRouter.get("/join/:chat_id", (req, res) => {
    res.send(`Join chat: ${req.params.chat_id}`);
});

// Create a new chat
chatRouter.get("/create", (req, res) => {
    // create a new chat and redirect user to that chat
    res.send(`Create a new chat`);
});

// Post a message to a chat
chatRouter.post("/:chat_id/:user_id/:message_content", (req, res) => {
    res.send("User post message");
});

// Set poll title
chatRouter.post("/:chat_id/:poll_title", (req, res) => {
    res.send("user set a poll title");
});

// Create a poll option
chatRouter.post("/:chat_id/poll/:poll_id/:poll_option", (req, res) => {
    res.send("User created a poll option");
});

// Vote for a poll option
chatRouter.post("/:chat_id/poll/:poll_id/vote/:poll_option_id", (req, res) => {
    res.send("User vote a poll option")
});

module.exports = chatRouter;