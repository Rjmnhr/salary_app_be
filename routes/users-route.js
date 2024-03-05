const express = require("express");
const UsersController = require("../controller/users-controller");
const authenticateToken = require("../utils/auth");
const router = express.Router();

router.get("/details", authenticateToken, UsersController.getUserData);
router.post("/upgrade", authenticateToken, UsersController.UpgradePlan);
router.post("/signup", UsersController.createUser);
router.post("/login", UsersController.loginUser);
router.post("/create-google-user", UsersController.createGoogleUser);
router.post("/reset-password", UsersController.resetPassword);
router.post("/change-email", UsersController.changeEmail);
router.post("/check", UsersController.checkForExistingUser);

module.exports = router;
