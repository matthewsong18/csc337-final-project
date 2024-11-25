const { Router } = require("express");

const chatRouter = Router();

// Get requests
chatRouter.get("/:chat_id", (req, res) => {
    res.send(`Chat ID: ${req.params.chat_id}`);
});

chatRouter.get("/:chat_id/:poll_id", (req, res) => {
    res.send(`Poll ID: ${req.params.poll_id}`);
});

// Post requests
chatRouter.post("/:chat_id/:user_id/:message_content", (req, res) => {
    res.send("User post message");
});

chatRouter.post("/:chat_id/:poll_title", (req, res) => {
    res.send("user set a poll title");
});

chatRouter.post("/:chat_id/poll/:poll_id/:poll_option", (req, res) => {
    res.send("User created a poll option");
});

chatRouter.post("/:chat_id/poll/:poll_id/vote/:poll_option_id", (req, res) => {
    res.send("User vote a poll option")
});

module.exports = chatRouter;