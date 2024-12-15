const mongoose = require("mongoose");

const { Poll, PollOption } = require("../models/index");
const ChatService = require("../services/ChatService");
const path = require('path');


async function create_poll(req, res) {
    try {
        // Extract the poll title and options from the request body
        const { poll_title, poll_options } = req.body;
        const { chat_pin } = req.params;
        const poll_option_ids = [];

        for (let i = 0; i < poll_options.length; i++) {
            const option = await PollOption.create({
                title: poll_options[i],
            });
            poll_option_ids.push(option._id);
            // console.log("Created poll option:", option);

        }

        // Create a new poll
        const newPoll = await Poll.create({
            title: poll_title,
            options: poll_option_ids,
        });

        // Save the poll to the database
        const savedPoll = await Poll.findById(newPoll._id)
            .populate("options", "title vote_count")
            .populate("users_voted", "user_name")
            .select("title options users_voted createdAt"); // no need to get chat._id

        // Respond with the saved poll
        ChatService.add_poll(chat_pin, savedPoll._id);

        // console.log(savedPoll);
        res.status(201).json(savedPoll);

    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    create_poll,
  };
  