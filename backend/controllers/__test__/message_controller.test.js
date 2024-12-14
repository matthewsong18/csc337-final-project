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
  "../message_controller.js",
);
const { generate_unique_pin } = require("../chatController.js");

describe("message_controller", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/message_controller_testdb",
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
  });

  // Testing save_message

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

  // Testing add_message_to_chat

  it("should add the message to chat", async () => {
    const user = await UserService.createUser("test user");
    const pin = await generate_unique_pin();
    let chat = await Chat.create({ users: [user._id], pin: pin });
    const message = await Message.create({ author: user._id, content: "Hi" });

    await add_message_to_chat(message._id, chat._id);

    chat = await Chat.findOne({ _id: chat._id });
    const last_message = chat.messages.at(-1);
    expect(last_message).toStrictEqual(message._id);
  });

  // Testing validate_inputs

  it("should return false when inputs are invalid", async () => {
    const input_status = await validate_inputs(null, null, null);

    expect(input_status).toBeDefined();
    expect(input_status).toHaveProperty("status", 400);
    expect(input_status).toHaveProperty("chat_pin_status", false);
    expect(input_status).toHaveProperty("user_id_status", false);
    expect(input_status).toHaveProperty("message_status", false);
  });

  it("should return true when inputs are valid", async () => {
    const user = await UserService.createUser("test user");
    const pin = await generate_unique_pin();
    const chat = await Chat.create({ users: [user._id], pin: pin });
    const message = "Test string";

    const input_status = await validate_inputs(chat.pin, user._id, message);

    expect(input_status).toBeDefined();
    expect(input_status).toHaveProperty("status", 200);
    expect(input_status).toHaveProperty("chat_pin_status", true);
    expect(input_status).toHaveProperty("user_id_status", true);
    expect(input_status).toHaveProperty("message_status", true);
  });

  // Testing respond_with_error_json

  it("should return an error json when something goes wrong", async () => {
    const response = await request(app)
      .post("/chat/message/1231541/asdfafds")
      .send({ message: "nonsense message" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("chat_pin_status", false);
    expect(response.body).toHaveProperty("user_id_status", false);
    expect(response.body).toHaveProperty("message_status", true);
  });

  it("should create a message when given valid inputs", async () => {
    const user = await UserService.createUser("Happy");
    const pin = await generate_unique_pin();
    const chat = await Chat.create({ users: [user._id], pin: pin });
    const message_string = "A test string message";

    const response = await request(app)
      .post(`/chat/message/${chat.pin}/${user._id}`)
      .send({message: message_string})
      .set("Content-Type", "application/json");
    try {
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        `${message_string}`,
      );
    } catch (error) {
      const json = JSON.stringify(response.body, null, 2);
      error.message = `${error.message}\n${json}`;
      throw error;
    }
  });

  it("should accept an encoded message", async () => {
    const user = await UserService.createUser("Happy");
    const pin = await generate_unique_pin();
    const chat = await Chat.create({ users: [user._id], pin: pin });
    const message_string = "@$&@#";
    // const encoded_string = encodeURIComponent(message_string);

    const response = await request(app)
    .post(`/chat/message/${chat.pin}/${user._id}`)
    .send({message: message_string})
    .set("Content-Type", "application/json");

    try {
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        `${message_string}`,
      );
    } catch (error) {
      const json = JSON.stringify(response.body, null, 2);
      error.message = `${error.message}\n${json}`;
      throw error;
    }
  });
});
