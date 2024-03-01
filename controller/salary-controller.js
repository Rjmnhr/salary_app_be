const SalaryModel = require("../models/salary-model");

const SalaryController = {
  getAllTitles: async (req, res) => {
    try {
      const data = await SalaryModel.getAllTitles(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getAllSectors: async (req, res) => {
    try {
      const data = await SalaryModel.getAllSectors(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  salaryData: async (req, res) => {
    try {
      const data = await SalaryModel.salaryData(req.body);
      console.log("🚀 ~ salaryData: ~ data:", data.length);

      res.status(200).json({ data: data.rows, bool: data.bool });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  salaryDataWithoutLoc: async (req, res) => {
    try {
      const data = await SalaryModel.salaryDataWithoutLoc(req.body);
      console.log("🚀 ~ salaryData: ~ data:", data.length);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  salaryDataWithoutExp: async (req, res) => {
    try {
      const data = await SalaryModel.salaryDataWithoutExp(req.body);
      console.log("🚀 ~ salaryData: ~ data:", data.length);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = SalaryController;
