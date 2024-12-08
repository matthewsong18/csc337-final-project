const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const UserService = require("../../services/UserService");
const User = require("../../models/User");

describe("userController", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Testing getUserByName
  it("should return the user profile when username exists", async () => {
    await UserService.createUser("Lauren");

    // Simulate GET request on app.js
    const response = await request(app).get("/auth/login/Lauren");

    expect(response.status).toBe(200);
    // checks we are sending json
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json"),
    );
    expect(response.body).toHaveProperty("user_name", "Lauren");
    expect(response.body).toHaveProperty("has_account", true);
  });

  it("should return a 404 error when the username does not exist", async () => {
    const response = await request(app).get("/auth/login/Bill");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      'User with username "Bill" not found.',
    );
  });

  // Test user_signup()
  it("should signup the user when calling user_signup", async () => {
    const response = await request(app).post("/auth/signup/Happy");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "status",
      201,
    );
    expect(response.body).toHaveProperty(
      "message",
      "User successfully signed-up as Happy",
    );
  });

  it("should return a 400 status code if the user_name already exists", async () => {
    await UserService.createUser("Happy");

    const response = await request(app).post("/auth/signup/Happy");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      'Error: User with username "Happy" already exists',
    );
  });

  it("should not throw an error on a really long user_name", async () => {
    const long_user_name = "webkajwebkjhaf!@$&)!&)!*(&*!$)" +
      "aksjfhasjkfhas;kfd;haslkdfjaslk;fjaskldfjweoir2oi3qr89ahfawfjadsfkjasdfkjasd" +
      "alkfas;dfhasf34y1081835ijafhaskfasfja;sdkfjabamnwjeopiaeurpioashfd;kajdfklas";
    const response = await request(app).post(`/auth/signup/${long_user_name}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      `User successfully signed-up as ${long_user_name}`,
    );

    const user = await UserService.findUser(long_user_name);
    expect(user).toBeDefined();
    expect(user.user_name).toBe(long_user_name);
  });

  it("should handle special characters like # in the user_name", async () => {
    const special_user_name = "@!#*)(@&#)(&@#!)user";
    const encoded_user_name = encodeURIComponent(special_user_name);

    const response = await request(app).post(
      `/auth/signup/${encoded_user_name}`,
    );
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      `User successfully signed-up as ${special_user_name}`,
    );

    const user = await UserService.findUser(special_user_name);
    expect(user).toBeDefined();
    expect(user.user_name).toBe(special_user_name);
  });
});
