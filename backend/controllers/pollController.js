const mongoose = require("mongoose");

const { Poll, PollOption } = require("../models/index");
const path = require('path');


async function create_poll(req, res) {
    try {
        // Extract the poll title and options from the request body
        const { poll_title, poll_options } = req.body;
        const poll_option_ids = [];

        for (let i = 0; i < poll_options.length; i++) {
            const option = await PollOption.create({
                title: poll_options[i],
            });
            poll_option_ids.push(option);
            console.log("Created poll option:", option);

        }

        // Create a new poll
        const newPoll = new Poll({
            title: poll_title,
            options: poll_option_ids,
        });

        // Save the poll to the database
        const savedPoll = await newPoll.save();

        // Respond with the saved poll
        console.log(JSON.stringify(savedPoll));
        res.status(201);
        return (savedPoll);

    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    create_poll,
  };
  