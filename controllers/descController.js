const db1 = require("../models");

const User_desc = db1.users_desc;

const addDesc = async (req, res) => {
  let data = {
    review: req.body.review,
    description: req.body.description,
  };

  const user_desc = await User_desc.create(data);
  res.status(200).json({
    error: false,
    result: user_desc,
    msg: "Review added successfully",
  });
};

const getAllDesc = async (req, res) => {
  const user_desc = await User_desc.findAll({});
  res.status(200).send(user_desc);
};

module.exports = {
  addDesc,
  getAllDesc,
};
