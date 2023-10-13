const express = require("express");
const SalaryController = require("../controller/salary-controller");
const router = express.Router();

router.post("/data", SalaryController.getAll);
router.post("/data/role", SalaryController.getByRole);
module.exports = router;
