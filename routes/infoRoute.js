const {
  addUserinfo,
  getAllUserinfo,
  getUserinfo,
  updateUserinfo,
  deleteUserinfo,
  GetUserImage,
  UploadUserImage,
  upload,
  encodeBase64Img,
  decodeBase64Img,
  getUserDesc,
  getUserEmail,
} = require("../controllers/infoController");

const { addDesc, getAllDesc } = require("../controllers/descController"); // desc controller

const { addEmail, getAllEmail } = require("../controllers/emailController"); // email controller

const { addEmailValidation } = require("../validations/mailValidate");

const router = require("express").Router();

router.post("/addUserinfo", addUserinfo);

router.post("/addDesc", addDesc); //desc

router.post("/addEmail", addEmail); //email

router.get("/getAllUserinfo", getAllUserinfo);

router.get("/AllDesc", getAllDesc); //desc

router.get("/AllEmail", getAllEmail); //email

router.post("/uploadSingleImage", upload.single("image"), UploadUserImage);

router.post("/encode", upload.single("image"), encodeBase64Img);

router.post("/decode", decodeBase64Img);

router.get("/getDesc", getUserDesc); //association reviews

router.get("/getEmail", getUserEmail); //association email, reviews with user

router.get("/getImage/:filename", GetUserImage);

router.get("/getUserinfo/:id", getUserinfo);

router.put("/updateUserinfo/:id", updateUserinfo);

router.delete("/deleteUserinfo/:id", deleteUserinfo);

module.exports = router;
