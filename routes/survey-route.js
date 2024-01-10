const express = require("express");
const multer = require("multer");
const SurveyController = require("../controller/survey-controller");

const router = express.Router();
const upload = multer();

// Define your routes
router.post(
  "/upload-excel",
  upload.single("file"),
  SurveyController.uploadExcel
);
router.post("/register", SurveyController.register);

module.exports = router;
