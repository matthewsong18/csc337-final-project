const mongoose = require("mongoose");
const { User } = require("..");

describe("User Schema", () => {
  // Connect to test database before running tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });

  // Disconnect after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test case: Creating a user
  it("should create a user with a user_name and has_account", async () => {
    const user = new User({ user_name: "Alice", has_account: true });
    const savedUser = await user.save();

    expect(savedUser.user_name).toBe("Alice");
    expect(savedUser.has_account).toBe(true);
  });
});
