const express = require("express");
const path = require("path");
const { post_message, subscribe_chat } = require("../controllers/chatController");
const chatRouter = express.Router();

// Get a chat
chatRouter.get("/:chat_id", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/chat.html"))
});

// Establish a SSE connection 
chatRouter.get("/:chat_id/events", subscribe_chat);

// Get a poll
chatRouter.get("/:chat_id/:poll_id", (req, res) => {
    res.send(`Poll ID: ${req.params.poll_id}`);
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

// Handle undefined routes
chatRouter.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/error.html"))
})

// Post a message to a chat
chatRouter.post("/:chat_id/:user_id/:message_content", post_message);

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