require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET = process.env.AUTH_SECRET;

exports.validateJWT = (req, res, next) => {
  const token = req.header("auth_token");
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  jwt.verify(token, SECRET, (err, dec) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  });

  req.user = jwt.verify(token, SECRET);
  next();
};
