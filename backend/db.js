const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "realestate",
});

connection.connect();

module.exports = connection;
