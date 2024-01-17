const express = require("express");
const KPIController = require("../controller/kpi-controller");
const router = express.Router();

router.get("/sectors", KPIController.getSectors);
router.get("/roles", KPIController.getRoles);
router.post("/report", KPIController.getReport);

module.exports = router;
