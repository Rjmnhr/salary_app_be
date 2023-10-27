const express = require("express");
const UsersController = require("../controller/users-controller");
const router = express.Router();

router.post("/signup", UsersController.createUser);
router.post("/login", UsersController.loginUser);
router.post("/create-google-user", UsersController.createGoogleUser);
router.post("/change-password", UsersController.changePassword);
router.post("/check", UsersController.checkForExistingUser);

module.exports = router;
