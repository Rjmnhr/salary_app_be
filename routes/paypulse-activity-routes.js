const express = require("express");
const PriceAJobActivityController = require("../controller/paypulse-activity-controller");
const router = express.Router();

router.post("/save-activity", PriceAJobActivityController.saveUserActivity);
router.post(
  "/save-activity-demo",
  PriceAJobActivityController.saveUserActivityDemo
);
router.get("/get-activity", PriceAJobActivityController.getUserActivity);
router.get(
  "/get-activity-demo",
  PriceAJobActivityController.getUserActivityDemo
);
router.post("/update-activity", PriceAJobActivityController.updateUserActivity);

module.exports = router;
