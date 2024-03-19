const getUserID = require("../utils/getUserID");
const PriceAJobActivityModel = require("../models/paypulse-activity-model");

const PriceAJobActivityController = {
  saveUserActivity: async (req, res) => {
    const userID = getUserID(req);

    try {
      const reportSaved = await PriceAJobActivityModel.saveUserActivity(
        req.body,
        userID
      );

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
  getUserActivity: async (req, res) => {
    const userID = getUserID(req);

    try {
      const data = await PriceAJobActivityModel.getUserActivity(userID);

      if (!data)
        return res
          .status(200)
          .json({ status: 400, message: "Fetching reports failed" });

      return res.status(200).json({ status: 200, data: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  updateUserActivity: async (req, res) => {
    try {
      const data = await PriceAJobActivityModel.updateUserActivity(req.body);

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

module.exports = PriceAJobActivityController;
