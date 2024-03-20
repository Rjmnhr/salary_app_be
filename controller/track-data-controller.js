const TrackedData = require("../models/track-data-model");

const TrackDataController = {
  saveTrackedData3: async (req, res) => {
    try {
      const dataToSave = {
        ...req.body,
        ipAddress: req.userIpAddress, // Add the IP address to the data
      };

      const data = await TrackedData.saveTrackedData3(dataToSave);
      res
        .status(200)
        .json({ status: 200, message: "data stored successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  saveTrackedData2: async (req, res) => {
    try {
      const dataToSave = {
        ...req.body,
        ipAddress: req.userIpAddress, // Add the IP address to the data
      };

      const data = await TrackedData.saveTrackedData2(dataToSave);
      res.status(200).json("data stored successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = TrackDataController;
