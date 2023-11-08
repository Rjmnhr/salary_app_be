const express = require("express");
const SalaryController = require("../controller/salary-controller");
const router = express.Router();

router.post("/data", SalaryController.getAll);

router.get("/roles", SalaryController.getAllRoles);
router.post("/data/role", SalaryController.getByRole);
router.post("/data/role/no-experience", SalaryController.getByRoleNoExperience);
module.exports = router;
