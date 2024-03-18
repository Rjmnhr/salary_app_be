const express = require("express");
const PriceAJobActivityController = require("../controller/paypulse-activity-controller");
const router = express.Router();

router.post("/save-activity", PriceAJobActivityController.saveUserActivity);
router.post("/get-activity", PriceAJobActivityController.getUserActivity);
router.post("/update-activity", PriceAJobActivityController.updateReport);

module.exports = router;
