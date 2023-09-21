const express = require("express");
const SalaryController = require("../controller/salary-controller");
const router = express.Router();

router.get("/data", SalaryController.getAll);

module.exports = router;
