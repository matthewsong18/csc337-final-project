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

  it("should create a message with an author, a chat, content, and a date", async () => {
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
    expect(message.date).toBeDefined();
  });
});
