const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/", userRouter);
// Error page
chatRouter.get("*", (req, res) => {
    res.send("* is a great way to catch all otherwise unmatched paths, e.g. for custom 404 error handling.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Achat app - listening on port ${PORT}!`);
});