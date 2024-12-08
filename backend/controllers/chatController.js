const mongoose = require("mongoose");
const path = require('path');
const { Chat, Message, Poll  } = require("../models/index");

async function load_message_buffer(message_ids, buffer_size, timestamp) {
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
}

async function load_poll_buffer(poll_ids, buffer_size, timestamp) {
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
}

function sort_by_timestamp(messages, polls, buffer_size) {
    let chat_history = messages.concat(polls);
    // Sort by createdAt in ascending order (latest -> oldest)
    try {
        if (chat_history.length == 0) return chat_history;
        chat_history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 
    } catch (err) {
        throw new Error(`Failed to sort chat_history: ${err.message}`);
    }
    if (buffer_size >= chat_history.length) return chat_history;
    return chat_history.slice(buffer_size);
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
    load_message_buffer,
    load_poll_buffer,
    sort_by_timestamp,
    is_valid_timestamp
}