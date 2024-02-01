const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.post("/register", controller.validateUser, controller.register);
router.post("/login", controller.login);

module.exports = router;
