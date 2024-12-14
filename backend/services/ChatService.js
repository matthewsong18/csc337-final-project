const Chat = require("../models/Chat.js");

class ChatService {
  static async add_message(chat_id, message_id) {
    const chat = await Chat.findOne({ _id: chat_id });
    if (!chat) {
      throw new Error("Chat does not exist");
    }

    const messages = chat.messages;
    messages.push(message_id);

    chat.messages = messages;

    await chat.save();
  }
}

module.exports = ChatService;
