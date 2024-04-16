const express = require("express");
const DemoController = require("../controller/demo-registration");
const router = express.Router();

router.post("/register", DemoController.demoRegister);

module.exports = router;
