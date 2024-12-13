const { Router } = require("express");
const path = require("path");
const chatRouter = Router();
const { get_chat, subscribe_to_chat, join_chat, create_chat } = require(
  "../controllers/chatController",
);
const { create_message } = require("../controllers/message_controller.js");

// Get a chat
chatRouter.get("/:chat_id", get_chat);

// Establish a SSE connection
chatRouter.get("/:chat_id/events", subscribe_to_chat);

// Get a poll
chatRouter.get("/:chat_id/poll/:poll_id", (req, res) => {
  res.send(`Poll ID: ${req.params.poll_id}`);
});

// Join a chat
chatRouter.get("/:chat_id/join", join_chat);

// Create a new chat
chatRouter.post("/create", create_chat);

// Post a message to a chat
chatRouter.post("/:chat_id/:user_id/:message_content", create_message);

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
  res.send("User vote a poll option");
});

// Handle undefined routes
chatRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/error.html"));
});

module.exports = chatRouter;
