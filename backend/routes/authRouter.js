const { Router } = require("express");
const { getUserByName, user_signup, get_chat_history } = require("../controllers/userController");
const path = require("path");
const authRouter = Router();

// Sign up a new user
authRouter.post("/signup/:user_name", user_signup);

// Get login page
authRouter.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/auth.html"));
});

// Get into user profile
authRouter.get("/login/:username", getUserByName);

// Get user's chat id
authRouter.get("/chats/:username", get_chat_history);

// Handle undefined routes
authRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/error.html"));
});

module.exports = authRouter;
