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

  it("save a message", async () => {
    const user = UserService.createUser("test_user_1");
    const message_string = "This is a test message.";

    const message_id = await save_message(message_string, user._id);

    expect(message_id).toBeDefined();
    const message = await Message.findOne({ _id: message_id });
    expect(message.content).toBe(message_string);
  });

  it("should create a message when given valid inputs", async () => {
    const user = await UserService.createUser("Happy");
    const chat = await Chat.create({ users: [user._id] });
    const message_string = "A test string message";

    const response = await request(app).post(
      `/${chat._id}/${user._id}/${message_string}`,
    );

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      `${message_string}`,
    );
  });
});
