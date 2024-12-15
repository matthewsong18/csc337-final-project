const { Router } = require("express");
const path = require("path");

const chatRouter = Router();
const {
  get_chat,
  subscribe_to_chat,
  join_chat_guest,
  join_chat_user,
  create_chat_guest,
  create_chat_user,
  message_post,
  get_user_info,
} = require("../controllers/chatController");
const { create_poll } = require("../controllers/pollController.js");

// Establish a SSE connection
chatRouter.get("/:chat_id/events", subscribe_to_chat);

// Get a chat
chatRouter.get("/:chat_id/:user_id", get_chat);

// Get a poll
chatRouter.get("/:chat_id/poll/:poll_id", (req, res) => {
  res.send(`Poll ID: ${req.params.poll_id}`);
});

// Join a chat as a guest
chatRouter.get("/:chat_pin/join/guest", join_chat_guest);

// Join a chat as a user
chatRouter.get("/:username/:chat_pin/join/user", join_chat_user);

// Getting user json by id for profile button
chatRouter.get("/:user_id/getuser/info", get_user_info);

// Create a new chat as guest
chatRouter.post("/create/guest", create_chat_guest);

// Create a new chat as user
chatRouter.post("/create/:username/:chat_name", create_chat_user);

// Post a message to a chat
chatRouter.post("/message/:chat_pin/:user_id", message_post);

// Post a poll to a chat
chatRouter.post("/poll/:chat_pin/create", create_poll);

// Vote for a poll option
chatRouter.post("/:chat_id/poll/:poll_id/vote/:poll_option_id", (req, res) => {
  res.send("User vote a poll option");
});

// Handle undefined routes
chatRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/error.html"));
});


module.exports = chatRouter;