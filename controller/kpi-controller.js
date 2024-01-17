const KPIModel = require("../models/kpi-model");

const KPIController = {
  getSectors: async (req, res) => {
    try {
      const data = await KPIModel.getSectors(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getRoles: async (req, res) => {
    try {
      const data = await KPIModel.getRoles(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getReport: async (req, res) => {
    try {
      const data = await KPIModel.getReport(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = KPIController;
