const express = require("express");
const app = express();

const indexRouter = require("./routes/indexRouter");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/", indexRouter);

// Error page
chatRouter.get("*", (req, res) => {
    res.send("* is a great way to catch all otherwise unmatched paths, e.g. for custom 404 error handling.");
});

module.exports = app;