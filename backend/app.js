const express = require("express");
const path = require("path");
const app = express();

// added to be able to use json req.body
app.use(express.json());

const indexRouter = require("./routes/indexRouter");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/", indexRouter);

module.exports = app;
