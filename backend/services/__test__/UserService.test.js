const mongoose = require("mongoose");
const UserService = require("../UserService.js");
const User = require("../../models/User.js");

describe("UserService", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany();
  });

  it("should prevent multiple accounts from having the same user_name", async () => {
    const user1 = await UserService.createUser({
      has_account: true,
      user_name: "Bob",
    });

    let err;

    try {
      const user2 = await UserService.createUser({
        user_name: "Bob",
        has_account: true,
      });
    } catch (error) {
      err = error;
    }

    expect(user1).toBeDefined();
    expect(user1.user_name).toBe("Bob");
    expect(err).toBeDefined();
  });
});
