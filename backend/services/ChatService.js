const Chat = require("../models/Chat.js");

class ChatService {
  static async add_message(chat_id, message_id) {
    const chat = await Chat.findById(chat_id);
    if (!chat) {
      throw new Error("Chat does not exist");
    }

    const messages = chat.messages;
    messages.push(message_id);

    chat.messages = messages;

    await chat.save();
  }

  static async add_poll(chat_pin, poll_id) {
    const chat = await Chat.findOne({ pin: chat_pin});
    if (!chat) {
      throw new Error("Chat does not exist");
    }

    const polls = chat.polls;
    polls.push(poll_id);

    chat.polls = polls;

    await chat.save();
  }
}

module.exports = ChatService;
