const bunyan = require("bunyan");

const log = bunyan.createLogger({
  name: "Todoist",
  stream: process.stdout,
});

module.exports = log;
