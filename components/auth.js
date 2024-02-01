require("dotenv").config();
const knex = require("knex");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET = process.env.AUTH_SECRET;

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  searchPath: ["knex", "public"],
});

exports.login = (req, res) => {
  const { ci, password } = req.body;
  console.log(req.body);

  db.select("*")
    .from("admins")
    .where("ci", ci)
    .then((r) => {
      if (r < 1) {
        res.status(401).json({ message: "Access denied" });
      }
      const token = require("jsonwebtoken").sign(
        {
          id: r[0].id,
          ci: r[0].ci,
        },
        SECRET
      );
      if (r.length > 0) {
        if (!bcrypt.compareSync(password, r[0].password)) {
          if (password === r[0].password) {
            res.status(202).json({
              message: "Not modified",
              auth_token: token,
            });
          } else {
            res.status(401).json({ message: "Access denied" });
          }
        } else {
          res.status(200).json({
            message: "Access granted",
            auth_token: token,
          });
        }
      } else {
        res.status(401).json({ message: "Access denied" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error getting admins", err });
      console.log(err);
    });
};

exports.changePass = (req, res) => {
  const { newPass } = req.body;
  const { ci } = req.user;
  const salt = bcrypt.genSaltSync(10);
  const cPass = bcrypt.hashSync(newPass, salt);

  db("admins")
    .where("ci", ci)
    .update({
      password: cPass,
    })
    .then((r) => {
      res.status(202).json({ message: "Password changed" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error changing password", err });
      console.log(err);
    });
};
