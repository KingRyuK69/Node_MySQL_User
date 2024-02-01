const jwt = require("jsonwebtoken");
const db = require("../config/database");
const bcrypt = require("bcryptjs");

exports.validateUser = (req, res, next) => {
  if (!req.body.email || req.body.email.length < 5) {
    return res.status(400).json({ message: "Email is too short." });
  }

  const domain = req.body.email.split("@")[1];
  if (domain !== "shyamsteel.com") {
    return res.status(400).json({
      message: "Invalid email domain.",
    });
  }

  next();
};

exports.register = (req, res) => {
  let user = { email: req.body.email };

  // Check if user already exists
  let checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, user.email, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // User already exists
      return res.status(400).json({
        error: true,
        result: null,
        msg: "User already exists",
      });
    } else {
      // User doesn't exist, proceed with registration
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          user.password = hash;
          let sql = "INSERT INTO users SET ?";
          db.query(sql, user, (err, result) => {
            if (err) throw err;
            res.status(200).json({
              error: false,
              result: result,
              msg: "User registered",
            });
          });
        }
      });
    }
  });
};

exports.login = (req, res) => {
  let sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.body.email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      if (req.body.password === results[0].password) {
        const token = jwt.sign({ id: results[0].id }, "Sohom@2023", {
          expiresIn: "1h",
        });
        res.json({ message: "Login Success", token });
      } else {
        res.send("Incorrect password");
      }
    } else {
      res.send("This email does not exist");
    }
  });
};
