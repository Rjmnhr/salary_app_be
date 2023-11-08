const BenchmarkModel = require("../models/benchmark-model");

const BenchmarkController = {
  getIndustries: async (req, res) => {
    try {
      const data = await BenchmarkModel.getIndustries(req.body);
      console.log(
        "🚀 ~ file: benchmark-controller.js:7 ~ getIndustries: ~ req.body:",
        req.body
      );

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompanies: async (req, res) => {
    try {
      console.log(
        "🚀 ~ file: benchmark-controller.js:18 ~ getCompanies: ~ req.body:",
        req.body
      );
      const data = await BenchmarkModel.getCompanies(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = BenchmarkController;
