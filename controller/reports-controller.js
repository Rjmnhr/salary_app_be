const getUserID = require("../utils/getUserID");
const ReportModel = require("../models/reports-model");

const ReportsController = {
  saveReports: async (req, res) => {
    const userID = getUserID(req);
    try {
      const reportSaved = await ReportModel.saveReports(req.body, userID);

      if (!reportSaved)
        return res
          .status(200)
          .json({ status: 200, message: "creating report failed" });

      return res
        .status(200)
        .json({ status: 200, message: "Report saved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  getReportByID: async (req, res) => {
    const userID = getUserID(req);

    try {
      const data = await ReportModel.getReportByID(userID);

      if (!data)
        return res
          .status(200)
          .json({ status: 400, message: "Fetching reports failed" });

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  updateReport: async (req, res) => {
    try {
      const data = await ReportModel.updateReport(req.body);

      if (!data)
        return res
          .status(200)
          .json({ status: 400, message: "Updating report failed" });

      return res
        .status(200)
        .json({ status: 200, message: " Report updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = ReportsController;
