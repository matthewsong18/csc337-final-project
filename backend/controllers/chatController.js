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
    is_valid_timestamp
}