const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "you should",
  password: "kill yourself now",
  database: "realestate",
});

connection.connect();

module.exports = connection;
