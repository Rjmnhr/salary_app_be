const SalaryModel = require("../models/salary-model");

const SalaryController = {
  getAll: async (req, res) => {
    try {
      const data = await SalaryModel.getAll(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = SalaryController;
