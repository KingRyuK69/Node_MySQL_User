const db1 = require("../models");

const User_email = db1.users_email;

const addEmail = async (req, res) => {
  let data = {
    email: req.body.email,
  };

  const user_email = await User_email.create(data);
  res.status(200).json({
    error: false,
    result: user_email,
    msg: "Review added successfully",
  });
};

const getAllEmail = async (req, res) => {
  const user_email = await User_email.findAll({});
  res.status(200).send(user_email);
};

module.exports = {
  addEmail,
  getAllEmail,
};
