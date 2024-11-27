const mongoose = require("mongoose");
const { User, Chat } = require("..");

describe("Chat Schema", () => {
  // Connect to a test database before running tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Clear collections before each test
  beforeEach(async () => {
    await User.deleteMany({});
    await Chat.deleteMany({});
  });

  it("should create a chat with a list of users", async () => {
    // Create users
    const user1 = await User.create({ user_name: "Alice", has_account: true });
    const user2 = await User.create({ user_name: "Bob", has_account: false });

    // Create a chat with the users
    const chat = await Chat.create({ users: [user1._id, user2._id] });

    // Verify the chat was created
    expect(chat).toBeDefined();
    expect(chat.users.length).toBe(2);
    expect(chat.users).toContainEqual(user1._id);
    expect(chat.users).toContainEqual(user2._id);
  });

  it("should populate user details in the chat", async () => {
    // Create users
    const user1 = await User.create({ user_name: "Alice", has_account: true });
    const user2 = await User.create({ user_name: "Bob", has_account: false });

    // Create a chat with the users
    const chat = await Chat.create({ users: [user1._id, user2._id] });

    // Find and populate the chat's users
    const populatedChat = await Chat.findById(chat._id).populate(
      "users",
      "user_name has_account",
    );

    // Verify the populated chat
    expect(populatedChat).toBeDefined();
    expect(populatedChat.users.length).toBe(2);
    expect(populatedChat.users[0].user_name).toBe("Alice");
    expect(populatedChat.users[0].has_account).toBe(true);
    expect(populatedChat.users[1].user_name).toBe("Bob");
    expect(populatedChat.users[1].has_account).toBe(false);
  });

  it("should not allow a chat without users", async () => {
    let err;
    try {
      await Chat.create({ users: [] });
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.name).toBe("ValidationError");
  });
});
