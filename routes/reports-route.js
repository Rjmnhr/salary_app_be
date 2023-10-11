const express = require("express");
const ReportsController = require("../controller/reports-controller");
const router = express.Router();

router.post("/save", ReportsController.saveReports);
router.post("/get", ReportsController.getReportByID);

module.exports = router;
