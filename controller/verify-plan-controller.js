const verifyPlanModel = require("../models/verifyPlan-model");
const jwt = require("jsonwebtoken");
const extractToken = (req) => {
  const authHeader = req.headers.token;
  const token = authHeader.split(" ")[1];
  return token;
};

function getUserIdFromToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return decoded.id;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null; // or handle the error appropriately
  }
}

const verifyPlanController = {
  verifyPlan: async (req, res) => {
    const token = extractToken(req);
    const userID = getUserIdFromToken(token);

    try {
      const data = await verifyPlanModel.verifyPlan(userID);
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = verifyPlanController;
