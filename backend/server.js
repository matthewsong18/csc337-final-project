// server.js (where our actual non-testing server will run)

const app = require("./app");

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Achat app - listening on port ${PORT}!`);
});

module.exports = server; // Export server for manual control if needed