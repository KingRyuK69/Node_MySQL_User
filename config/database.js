const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb",
});

db.connect((err) => {
  if (err) throw err;
  console.log("DB connected".bgCyan);
});

module.exports = db;
