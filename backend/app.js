const express = require("express");
const path = require("path");
const app = express();

const indexRouter = require("./routes/indexRouter");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");

app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/", indexRouter);

// chatRouter.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/public/error.html"));
// });

module.exports = app;
