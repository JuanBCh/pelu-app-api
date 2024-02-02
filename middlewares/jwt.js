require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET = process.env.AUTH_SECRET;

exports.validateJWT = (req, res, next) => {
  const token = req.header("auth_token");
  if (!token) {
    console.log("error1");
    return res.status(401).json({ message: "Access denied" });
  }
  jwt.verify(token, SECRET, (err, dec) => {
    if (err) {
      console.log("error2");
      return res.status(401).json({ message: "Invalid token" });
    }
  });

  req.admin = true;
  req.user = jwt.verify(token, SECRET);
  next();
};
