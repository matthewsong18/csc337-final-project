const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app.js");
const User = require("../../models/User.js");
const UserService = require("../../services/UserService.js");
const Chat = require("../../models/Chat.js");
const Message = require("../../models/Message.js");
const {
  validate_inputs,
  save_message,
  add_message_to_chat,
} = require(
  "../chat_controller.js",
);

describe("chat_controller", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/chat_controller_testdb");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
  });

  it("should save a message", async () => {
    const user = await UserService.createUser("test_user_1");
    expect(user).toBeDefined();
    const message_string = "This is a test message.";

    const message_id = await save_message(message_string, user._id);

    expect(message_id).toBeDefined();
    const message = await Message.findOne({ _id: message_id });
    expect(message.content).toBe(message_string);
  });

  it("should throw an error on bad message bad inputs", async () => {
    await expect(async () => await save_message(null, null)).rejects.toThrow();
  });

  it("should add the message to chat", async () => {
    const user = await UserService.createUser("test user");
    chat = await Chat.create({ users: [user._id] });
    const message = await Message.create({ author: user._id, content: "Hi" });

    await add_message_to_chat(message._id, chat._id);

    chat = await Chat.findOne({ _id: chat._id });
    const last_message = chat.messages.at(-1);
    expect(last_message).toStrictEqual(message._id);
  });

  // it("should create a message when given valid inputs", async () => {
  //   const user = await UserService.createUser("Happy");
  //   const chat = await Chat.create({ users: [user._id] });
  //   const message_string = "A test string message";

  //   const response = await request(app).post(
  //     `/${chat._id}/${user._id}/${message_string}`,
  //   );

  //   expect(response.status).toBe(201);
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     `${message_string}`,
  //   );
  // });
});
