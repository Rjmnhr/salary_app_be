const express = require("express");
const BenchmarkController = require("../controller/benchmark-controller");
const router = express.Router();

router.get("/industries", BenchmarkController.getIndustries);
router.post("/companies-hand", BenchmarkController.getCompaniesByHandSelect);
router.post("/companies-index", BenchmarkController.getCompaniesByIndex);
router.post("/data", BenchmarkController.getData);
module.exports = router;
