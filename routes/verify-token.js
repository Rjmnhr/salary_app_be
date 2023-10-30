const jwt = require("jsonwebtoken");
const router = require("express").Router();
const verifyPlanController = require("../controller/verify-plan-controller");

function verify(req, res, next) {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("you are not authenticated");
  }
}

router.get("/verify", verify, async (req, res) => {
  try {
    res.status(200).json("verified");
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/plan", verify, verifyPlanController.verifyPlan);

module.exports = router;
