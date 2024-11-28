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

  // Clear collections before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Test case: Creating a user
  it("should create a user with a user_name and has_account", async () => {
    const user = await User.create({ user_name: "Alice", has_account: true });

    expect(user.user_name).toBe("Alice");
    expect(user.has_account).toBe(true);
  });

  it("should create a user with no user_name", async () => {
    const guest_user = await User.create({});

    expect(guest_user.user_name).toBeUndefined();
    expect(guest_user.has_account).toBe(false);
  });

  it("should not allow a user to have a user_name when has_account is false", async () => {
    let err;

    try {
      await User.create({ user_name: "Alice" });
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
  });
});
