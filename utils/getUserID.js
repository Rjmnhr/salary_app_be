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

const getUserID = (req) => {
  const token = extractToken(req);
  const userID = getUserIdFromToken(token);

  return userID;
};

module.exports = getUserID;
