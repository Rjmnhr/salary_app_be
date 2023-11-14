const express = require("express");
const BenchmarkController = require("../controller/benchmark-controller");
const router = express.Router();

router.get("/sectors", BenchmarkController.getSectors);
router.get("/distinct-companies", BenchmarkController.getDistinctCompanies);
router.post("/industries", BenchmarkController.getIndustries);
router.post("/companies-hand", BenchmarkController.getCompaniesByHandSelect);
router.post(
  "/companies-hand/count",
  BenchmarkController.getCompaniesByHandSelectCount
);
router.post("/companies-index", BenchmarkController.getCompaniesByIndex);
router.post("/data", BenchmarkController.getData);
router.post("/data/2021", BenchmarkController.getData2021);
router.post("/companies-count", BenchmarkController.getCompaniesCount);
router.post(
  "/companies-count-metrics",
  BenchmarkController.getCompaniesCountByMetrics
);
module.exports = router;
