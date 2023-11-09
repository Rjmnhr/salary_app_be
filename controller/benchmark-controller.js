const BenchmarkModel = require("../models/benchmark-model");

const BenchmarkController = {
  getData: async (req, res) => {
    try {
      const data = await BenchmarkModel.getData(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getIndustries: async (req, res) => {
    try {
      const data = await BenchmarkModel.getIndustries(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompanies: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompanies(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = BenchmarkController;
