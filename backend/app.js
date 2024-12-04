const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

const indexRouter = require("./routes/indexRouter");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");

app.use(express.static(path.join(__dirname, "../frontend/public")));

const mongoURI = "mongodb://localhost:27017/myDatabase";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB on localhost");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/", indexRouter);

chatRouter.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/error.html"));
});

module.exports = app;

app.listen(3000, '127.0.0.1', () => {
    console.log('Server is running at http://127.0.0.1:5000/');
});
