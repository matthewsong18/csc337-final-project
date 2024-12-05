const mongoose = require("mongoose");
const UserService = require("../UserService.js");
const User = require("../../models/User.js");

describe("UserService", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should prevent multiple accounts from having the same user_name", async () => {
    const user1 = await UserService.createUser("Bob");

    let err;

    try {
      await UserService.createUser("Bob");
    } catch (error) {
      err = error;
    }

    expect(user1).toBeDefined();
    expect(user1.user_name).toBe("Bob");
    expect(err).toBeDefined();
  });

  // Testing findUser
  it("should retrieve a user by username if the user exists", async () => {
    await UserService.createUser("Lauren");

    const foundUser = await UserService.findUser("Lauren");

    expect(foundUser).toBeDefined();
    expect(foundUser.user_name).toBe("Lauren");
    expect(foundUser.has_account).toBe(true);
  });

  it("should throw an error if the user is not found", async () => {
    let error;

    try {
      await UserService.findUser("Bill");
    } catch (err) {
      error = err;
    }

    // Assert: Verify an error is thrown
    expect(error).toBeDefined();
    expect(error.message).toBe('User with username "Bill" not found.');
  });
});
