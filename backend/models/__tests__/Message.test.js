const mongoose = require("mongoose");
const { User, Chat, Message } = require("..");

describe("Message Schema", () => {
  // Connect to test database before running tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });

  // Disconnect after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Clear collections before each test
  beforeEach(async () => {
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
  });

  it("should create a message with an author, a chat, and content", async () => {
    const user = await User.create({ user_name: "Alice", has_account: true });
    const chat = await Chat.create({ users: [user._id] });
    const message = await Message.create({
      author: user._id,
      chat: chat._id,
      content: "Hello",
    });

    expect(message.author).toBe(user._id);
    expect(message.chat).toBe(chat._id);
    expect(message.content).toBe("Hello");
  });

  it("should ensure that a message has an author, chat, and content", async () => {
    await expect(async () => await Message.create({})).rejects.toThrow();

    const user = await User.create({ has_account: true, user_name: "Happy" });
    await expect(async () => await Message.create({ author: user })).rejects
      .toThrow();

    const chat = await Chat.create({ users: [user] });
    await expect(async () => await Message.create({ author: user, chat: chat }))
      .rejects
      .toThrow();
  });

  it("should ensure that message's createdAt timestamp is immutable", async () => {
    const user = await User.create({
      has_account: true,
      user_name: "TimeKeeper",
    });
    const chat = await Chat.create({ users: [user] });
    const message = await Message.create({
      author: user,
      chat: chat,
      content: "I am the timekeeper.",
    });

    expect(message.createdAt).toBeDefined();
    const message_created_timestamp = message.createdAt;
    message.createdAt = Date.now();
    expect(message.createdAt).toBe(message_created_timestamp);
  });
});
