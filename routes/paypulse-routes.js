const express = require("express");
const PriceAJobController = require("../controller/paypulse-controller");
const router = express.Router();

//input routes

router.get("/titles", PriceAJobController.getAllTitles);
router.post("/sectors", PriceAJobController.getAllSectors);
router.post("/valid-inputs", PriceAJobController.getValidInputs);
router.post("/top-skills", PriceAJobController.getTopSkills);
router.post("/relevant-skills", PriceAJobController.getRelevantSkills);

//output routes
router.post("/salary-data", PriceAJobController.salaryData);
router.post("/salary-data-no-loc", PriceAJobController.salaryDataWithoutLoc);
router.post("/salary-data-no-exp", PriceAJobController.salaryDataWithoutExp);
router.post("/skillIQ/median-salary", PriceAJobController.skillIQMedianSalary);

module.exports = router;
