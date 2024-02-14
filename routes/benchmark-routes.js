const express = require("express");
const BenchmarkController = require("../controller/benchmark-controller");
const router = express.Router();

router.get("/sectors", BenchmarkController.getSectors);
router.get("/sectors-uk", BenchmarkController.getSectorsUK);
router.get("/distinct-companies", BenchmarkController.getDistinctCompanies);
router.post("/industries", BenchmarkController.getIndustries);
router.post("/industries-index", BenchmarkController.getIndustriesByIndex);
router.post("/companies-hand", BenchmarkController.getCompaniesByHandSelect);
router.post(
  "/companies-hand-uk",
  BenchmarkController.getCompaniesByHandSelectUK
);
router.post(
  "/companies-hand/count",
  BenchmarkController.getCompaniesByHandSelectCount
);
router.post(
  "/companies-index/count",
  BenchmarkController.getCompaniesByIndexCount
);
router.post("/companies-index", BenchmarkController.getCompaniesByIndex);
router.post("/data", BenchmarkController.getData);
router.post("/data/2021", BenchmarkController.getData2021);
router.post("/data/2022", BenchmarkController.getData2022);
router.post("/companies-count", BenchmarkController.getCompaniesCount);
router.post("/companies-count-index", BenchmarkController.getCompaniesCount);
router.post(
  "/companies-count-metrics",
  BenchmarkController.getCompaniesCountByMetrics
);
router.post(
  "/companies-count-indices",
  BenchmarkController.getCompaniesCountIndices
);
module.exports = router;
