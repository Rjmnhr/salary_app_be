const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.token;
  console.log("🚀 ~ authenticateToken ~ authHeader:", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.json({ status: 403, message: "Token is not valid!" });
      req.user = user;
      next();
    });
  } else {
    return res.json({ status: 401, message: "you are not authenticated" });
  }
}

module.exports = authenticateToken;
