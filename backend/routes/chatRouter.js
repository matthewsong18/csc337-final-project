const { Router } = require("express");
const path = require("path");

const chatRouter = Router();

const { get_chat, subscribe_to_chat, 
    join_chat_guest, join_chat_user, 
    create_chat_guest, create_chat_user, 
	new_poll, vote_option
    } = require("../controllers/chatController");

const { create_message } = require("../controllers/message_controller.js");

// Get a chat
chatRouter.get("/:chat_id/:user_id", get_chat);

// Establish a SSE connection
chatRouter.get("/:chat_id/events", subscribe_to_chat);

// Get a poll
chatRouter.get("/:chat_id/poll/:poll_id", (req, res) => {
  res.send(`Poll ID: ${req.params.poll_id}`);
});

chatRouter.post("/:chat_id/poll", new_poll);

// Join a chat as a guest
chatRouter.get("/:chat_pin/join/guest", join_chat_guest);

// Join a chat as a user
chatRouter.get("/:username/:chat_pin/join/user", join_chat_user);

// Create a new chat as guest
chatRouter.post("/create/guest", create_chat_guest);

// Create a new chat as user
chatRouter.post("/create/:username/:chat_name", create_chat_user);

// Post a message to a chat
chatRouter.post("/:chat_id/:user_id/:message_content", create_message);

// Set poll title
chatRouter.post("/:chat_id/poll/:poll_title", (req, res) => {
  res.send("user set a poll title");
});

// Create a poll option
//chatRouter.post("/:chat_id/poll/:poll_id/:poll_option", (req, res) => {
	//console.log("Creating poll option");
  //res.send("User created a poll option");
//});

// Vote for a poll option
chatRouter.post("/:chat_id/poll/:poll_id/vote/", vote_option);

// Handle undefined routes
chatRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/error.html"));
});

module.exports = chatRouter;
