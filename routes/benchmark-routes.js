const express = require("express");
const BenchmarkController = require("../controller/benchmark-controller");
const router = express.Router();

router.get("/industries", BenchmarkController.getIndustries);
router.post("/companies", BenchmarkController.getCompanies);
router.post("/data", BenchmarkController.getData);
module.exports = router;
