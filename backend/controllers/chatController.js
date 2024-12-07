const mongoose = require("mongoose");
const path = require('path');
const { Chat, Message, Poll  } = require("../models/index");

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
    is_valid_timestamp
}