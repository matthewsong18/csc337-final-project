// server.js (where our actual non-testing server will run)

const app = require("./app");
const mongoose = require("mongoose");

function run_server(DATABASE_URL, PORT) {
  start_database_connection(DATABASE_URL);
  start_listening(PORT);
}

function start_database_connection(DATABASE_URL) {
  mongoose.connect(DATABASE_URL)
    .then(() => {
      console.log("Connected to MongoDB on 127.0.0.1");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
    });
}

function start_listening(PORT) {
  app.listen(PORT, () => {
    console.log(`Achat app - listening on: http://127.0.0.1:${PORT}`);
  });
}

run_server("mongodb://127.0.0.1:27017/myDatabase", 3000);
