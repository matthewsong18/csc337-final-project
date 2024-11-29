const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); 
const UserService = require("../../services/UserService");
const User = require ("../../models/User");

describe("userController", () => {

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany();
  });

  // Testing getUserByName
  it("should return the user profile when username exists", async () => {
    const testUser = await UserService.createUser({
      user_name: "Lauren",
      has_account: true,
    });

    // simulates GET request on app.js
    const response = await request(app).get("/auth/login/Lauren");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user_name", "Lauren");
    expect(response.body).toHaveProperty("has_account", true);
  });

  it("should return a 404 error when the username does not exist", async () => {
    const response = await request(app).get("/auth/login/Bill");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      'User with username "Bill" not found.'
    );
  });
});
