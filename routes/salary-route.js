const express = require("express");
const SalaryController = require("../controller/salary-controller");
const router = express.Router();

router.post("/data", SalaryController.salaryData);
router.post("/sectors", SalaryController.getAllSectors);
router.get("/titles", SalaryController.getAllTitles);
router.post("/data/no-location", SalaryController.salaryDataWithoutLoc);
router.post("/data/no-experience", SalaryController.salaryDataWithoutExp);
module.exports = router;
