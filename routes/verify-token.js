const jwt = require("jsonwebtoken");
const router = require("express").Router();
const verifyPlanController = require("../controller/verify-plan-controller");
const { getUserData } = require("../models/users-model");

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

function verify(req, res, next) {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ status: 403, message: "Token is not valid!" });
      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ status: 401, message: "you are not authenticated" });
  }
}

router.get("/verify", verify, async (req, res) => {
  try {
    const token = extractToken(req);
    const userId = getUserIdFromToken(token);

    res.status(200).json({ status: 200, message: "verified" });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/plan", verify, verifyPlanController.verifyPlan);

module.exports = router;
