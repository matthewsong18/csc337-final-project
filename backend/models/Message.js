const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
