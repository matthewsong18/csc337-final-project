const mongoose = require("mongoose");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Chat, Message, Poll  } = require("../models/index");

let connections = {};

async function post_message(req, res) {
    const { new_message, chat_id } = req.params;
    update_clients_in_chat(new_message, chat_id);
    res.send("User post message");
}

function update_clients_in_chat(new_update, chat_id) {
    let clients = connections[chat_id];
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(new_update)}\n\n`));
}

async function subscribe_chat(req, res) {
    try {
        const { chat_id } = req.params;
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);

        const chat_buffer = await load_chat(chat_id, Date.now());
        const data = `data: ${JSON.stringify(chat_buffer)}\n\n`;
        res.write(data);

        // Use a unique id for each client
        const clientId = uuidv4(); 
        // Add the client to the connections object
        if (!connections[chat_id]) {
            connections[chat_id] = [];
        }
        connections[chat_id].push({
            id: clientId,
            response: res
        });

        req.on("close", () => {
            // Remove the client from the chat_id's connections
            connections[chat_id] = connections[chat_id].filter(client => client.id !== clientId);
            res.end(); // close the connection
        })
    } catch(err) {
        throw new Error(`${err.message}`);
    }
}

async function load_chat(chat_id, timestamp, buffer_size=10) {
    try {
        // validate chat_id (2 steps)
        const is_valid_id = mongoose.Types.ObjectId.isValid(chat_id);
        if (!is_valid_id) {
            throw new Error("Invalid chat id");
        }

        const existing_chat = await Chat.findById(chat_id);
        if (!existing_chat) {
            throw new Error("This chat doesn't exist");
        }

        // validate timestamp format
        if (!is_valid_timestamp(timestamp)) {
            throw new Error("Timestamp requested is invalid");
        } 
        // validate timestamp logic
        if (new Date(timestamp) > Date.now()) {
            throw new Error("Timestamp requested is in the future");
        }

        const chat = await Chat.findById({ _id: chat_id });
        const messages = await load_message_buffer(chat.message, buffer_size, timestamp);
        const polls = await load_poll_buffer(chat.polls, buffer_size, timestamp);
        return sort_by_timestamp(messages, polls, buffer_size);
    } catch (err) {
        throw new Error(`${err.message}`);
    }
}

async function load_message_buffer(message_ids, buffer_size, timestamp) {
    try {
        let messages = [];
        if (message_ids.length === 0) return messages;
        // return x messages based on timestamps provided
        messages = await Message.find({
            _id: { $in: message_ids },
            createdAt: { $lte: new Date(timestamp) }, // Filter messages before the given timestamp
        })
        .limit(buffer_size)
        .populate("author", "user_name has_account")
        .select("author content createdAt")
        return messages;
    } catch (err) {
        throw new Error(`Failed to load message buffer: ${err.message}`);
    }
}

async function load_poll_buffer(poll_ids, buffer_size, timestamp) {
    try {
        let polls = [];
        if (poll_ids.length === 0) return polls;
        // return x polls based on timestamps provided
        polls = await Poll.find({
            _id: { $in: poll_ids},
            createdAt: { $lte: new Date(timestamp) }, // Filter polls before the given timestamp
        })
        .limit(buffer_size)
        .populate("options", "title vote_count")
        .populate("users_voted", "user_name")
        .select("title options users_voted createdAt") // no need to get chat._id
        return polls;
    } catch (err) {
        throw new Error(`Failed to load poll buffer: ${err.message}`);
    }
}

function sort_by_timestamp(messages, polls, buffer_size) {
    try {
        const chat_history = [...messages, ...polls];
        if (chat_history.length == 0) return chat_history;
        // Sort by createdAt in ascending order (latest -> oldest)
        chat_history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 
        if (buffer_size >= chat_history.length) return chat_history;
        return chat_history.slice(buffer_size);
    } catch (err) {
        throw new Error(`Failed to sort chat_history: ${err.message}`);
    }
}

function is_valid_timestamp(timestamp) {
    if (timestamp === null) {
        return false;
    }
    if (typeof timestamp === "Date") {
        return !isNaN(timestamp.getTime());
    }
    const date = new Date(timestamp);
    return !isNaN(date.getTime()) && !isNaN(date.getMinutes());
}

module.exports = {
    post_message,
    subscribe_chat,
    load_chat,
    load_message_buffer,
    load_poll_buffer,
    sort_by_timestamp,
    is_valid_timestamp
}