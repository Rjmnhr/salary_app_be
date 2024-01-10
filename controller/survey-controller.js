const SurveyModel = require("../models/survey-model");

const SurveyController = {
  uploadExcel: async (req, res) => {
    try {
      // Assuming the file is uploaded using multer and available in req.file.buffer
      const result = await SurveyModel.storeExcelData(req.file.buffer);

      res.status(200).json(result);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  register: async (req, res) => {
    try {
      // Assuming the file is uploaded using multer and available in req.file.buffer
      const result = await SurveyModel.register(req.body);

      res.status(200).json(result);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = SurveyController;
