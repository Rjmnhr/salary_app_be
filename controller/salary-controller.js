const SalaryModel = require("../models/salary-model");

const SalaryController = {
  getAllRoles: async (req, res) => {
    try {
      const data = await SalaryModel.getAllRoles(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await SalaryModel.getAll(req.body);

      res.status(200).json({ data: data.rows, bool: data.bool });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getByRole: async (req, res) => {
    try {
      const data = await SalaryModel.getByRole(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getByRoleNoExperience: async (req, res) => {
    try {
      const data = await SalaryModel.getByRoleNoExperience(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = SalaryController;
