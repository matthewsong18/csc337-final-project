const express = require("express");
const path = require("path");
const chatRouter = express.Router();
const Chat = require("../models/Chat.js");

// Join a chat
chatRouter.get("/join/:chat_id", async (req, res) => {
	console.log("GET request recieved");
    const chatId = req.params.chat_id;

    try {
		console.log("Attempting to find chat");
        const chat = await Chat.findOne({ pin: chatId });
		console.log("Chat found");

        if (chat) {
			res.json({ exists: true });
        } else {
            res.status(404).json({ exists: false, message: "Chatroom not found." });
        }
    } catch (error) {
        console.error("Error checking chatroom existence:", error);
        res.status(500).json({ message: "An error occurred while checking the chatroom." });
    }
});

//Utility function to generate PIN
function generateRandomPin() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

// Create a new chat
chatRouter.post("/create", async (req, res) => {
	console.log("POST request recieved");
    const pin = generateRandomPin();  // Generate a random PIN
    const chatName = "Anonymous Chat";  // Set a default chat name

    try {
		console.log("Attempting to create new Chat")
        // Create a new chat instance
        const newChat = new Chat({
            name: chatName,
            pin: pin,
            users: [],  // No users initially
            message: [], // No messages initially
        });
		console.log("Chat created successfully")

        // Save the chat to the database
        try {
			// Attempt to save the new chat instance to the database
			await newChat.save();
			console.log("Chat saved successfully");

			// Send a response after saving the chat
			res.json({ chatId: pin });
		} catch (error) {
			// Log the error details to understand what went wrong
			console.error("Error saving chat:", error);
			return res.status(500).json({ message: "An error occurred while creating the chat" });
		}
    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({ message: "An error occurred while creating the chat" });
    }
});

// Get a chat
chatRouter.get("/:chat_id", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/chat.html"))
});

// Get a poll
chatRouter.get("/:chat_id/:poll_id", (req, res) => {
    res.send(`Poll ID: ${req.params.poll_id}`);
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

// Handle undefined routes
chatRouter.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/error.html"))
})

module.exports = chatRouter;