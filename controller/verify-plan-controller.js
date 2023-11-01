const verifyPlanModel = require("../models/verifyPlan-model");

const verifyPlanController = {
  verifyPlan: async (req, res) => {
    console.log(
      "🚀 ~ file: verify-plan-controller.js:7 ~ verifyPlan: ~ req.body:",
      req.body
    );
    try {
      const data = await verifyPlanModel.verifyPlan(req.body);
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = verifyPlanController;
