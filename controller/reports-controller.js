const ReportModel = require("../models/reports-model");

const ReportsController = {
  saveReports: async (req, res) => {
    try {
      const reportSaved = await ReportModel.saveReports(req.body);

      if (!reportSaved) return res.status(200).json("creating report failed");

      return res.status(200).json("Report saved successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  getReportByID: async (req, res) => {
    try {
      const data = await ReportModel.getReportByID(req.body);

      if (!data) return res.status(200).json("Data fetching failed");

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = ReportsController;
