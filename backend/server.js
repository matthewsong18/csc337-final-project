// server.js (where our actual non-testing server will run)

const app = require("./app");
const mongoose = require("mongoose");

const PORT = 3000;

const mongoURI = "mongodb://localhost:27017/myDatabase";

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB on localhost");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

const server = app.listen(PORT, () => {
  console.log(`Achat app - listening on: http://localhost:${PORT}`);
});

module.exports = server; // Export server for manual control if needed