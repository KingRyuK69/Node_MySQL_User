const db1 = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const base64 = require("base64-img");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
// require("dotenv").config();

//create main model
const User_info = db1.users_info; // the initialized model is assigned to db1.users_info.
const User_desc = db1.users_desc; // the initialized model is assigned to db1.users_desc.
const User_email = db1.users_email; // the initialized model is assigned to db

const addUserinfo = async (req, res) => {
  try {
    let info = {
      name: req.body.name,
      phone_number: req.body.phone_number,
    };

    // Check if user already exists
    const existingUser = await db1.users_info.findOne({
      where: { name: info.name, phone_number: info.phone_number },
    });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        result: null,
        msg: "User already exists",
      });
    }

    const user_info = await db1.users_info.create(info);

    // create a JWT token
    const token = jwt.sign({ id: user_info.id }, process.env.JWT_Secret, {
      expiresIn: "1h",
    });

    res.status(200).json({
      error: false,
      result: user_info,
      token: token,
      msg: "User created successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//get all users
const getAllUserinfo = async (req, res) => {
  let user_info = await User_info.findAll({});
  res.status(200).send(user_info);
};

//get a user
const getUserinfo = async (req, res) => {
  let id = req.params.id;
  let user_info = await User_info.findOne({ where: { id: id } });
  res.status(200).send(user_info);
};

//update a user info
const updateUserinfo = async (req, res) => {
  try {
    const token = req.headers?.Authorization || req.headers?.authorization;
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id;

    let info = {
      name: req.body.name,
      phone_number: req.body.phone_number,
    };

    await User_info.update(info, { where: { id: userId } });
    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Multer configuration
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({
  storage: fileStorageEngine,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      req.fileValidationError = "Wrong extension";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  },
});

// Upload user image
const UploadUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ message: "Single File Uploaded", file: req.file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Encode base64 image
const encodeBase64Img = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const encodedImage = await base64.base64Sync(imagePath);

    res.status(200).json({ base64Image: encodedImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//decode base64 img
const decodeBase64Img = async (req, res) => {
  try {
    const base64String = req.body.image;
    const filename = req.body.filename;
    base64.img(
      base64String,
      "./uploads",
      filename,
      async function (err, filepath) {
        if (err) {
          throw new Error("Failed to save image");
        }
        // Convert the relative path to absolute path
        const absolutePath = path.resolve(filepath);
        // Check if the file exists before sending
        if (fs.existsSync(absolutePath)) {
          res.sendFile(absolutePath);
        } else {
          throw new Error("File not found");
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user image
const GetUserImage = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join("images", filename);

    if (fs.existsSync(filePath)) {
      res.status(200).download(filePath, filename);
    } else {
      throw new Error("File not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// delete a user
const deleteUserinfo = async (req, res) => {
  let id = req.params.id;
  await User_info.destroy({ where: { id: id } });
  res.status(200).send({ message: "User deleted" });
};

//get user desc (reviews)
const getUserDesc = async (req, res) => {
  try {
    const data = await User_info.findAll({
      include: [
        {
          model: User_desc,
          as: "user_desc",
        },
      ],
      where: { id: 5 },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get user email
// const getUserEmail = async (req, res) => {
//   try {
//     const data = await User_info.findAll({
//       include: [
//         {
//           model: User_email,
//           as: "user_email",
//         },
//         {
//           model: User_desc,
//           as: "user_desc",
//         },
//       ],
//       where: { id: 7 },
//     });
//     res
//       .status(200)
//       .json({ error: false, result: data, msg: "Info Retrieved Successfully" });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// wrap the whole data into one object
// const getUserEmail = async (req, res) => {
//   try {
//     const data = await User_info.findOne({
//       include: [
//         {
//           model: User_email,
//           as: "user_email",
//         },
//         {
//           model: User_desc,
//           as: "user_desc",
//         },
//       ],
//       where: { id: 7 },
//     });

//     // wrap the data inside another object then delete the previous models
//     const wrappedData = {
//       ...data.get(),
//       email: data.user_email[0].email,
//       review: data.user_desc[0].review,
//       description: data.user_desc[0].description,
//       user_id: data.user_email[0].user_id,
//     };
//     delete wrappedData.user_email;
//     delete wrappedData.user_desc;

//     res.status(200).json({
//       error: false,
//       result: wrappedData,
//       msg: "Info Retrieved Successfully",
//     });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// wrap the whole data into one object
const getUserEmail = async (req, res) => {
  try {
    const data = await User_info.findOne({
      where: { id: 7 },
      attributes: [
        "id",
        "name",
        "phone_number",
        [sequelize.col("user_email.email"), "email"],
        [sequelize.col("user_email.user_id"), "user_id"],
        [sequelize.col("user_desc.review"), "review"],
        [sequelize.col("user_desc.description"), "description"],
      ],
      include: [
        {
          model: User_email,
          as: "user_email",
          attributes: [], // to exclude other attributes
        },
        {
          model: User_desc,
          as: "user_desc",
          attributes: [],
        },
      ],
    });

    res.status(200).json({
      error: false,
      result: data,
      msg: "Info Retrieved Successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addUserinfo,
  getAllUserinfo,
  getUserinfo,
  updateUserinfo,
  deleteUserinfo,
  UploadUserImage,
  GetUserImage,
  upload,
  decodeBase64Img,
  encodeBase64Img,
  getUserDesc,
  getUserEmail,
};
