require("dotenv").config();
const knex = require("knex");

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

exports.clientTreatments = (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("treatments")
    .where("client_id", id)
    .orderBy("date", "desc")
    .then((data) => {
      res.status(200).json(data);
    });
};

exports.addTreatment = (req, res) => {
  const { clientId, date, description } = req.body;
  db("treatments")
    .insert({
      client_id: clientId,
      date: date,
      treatment: description,
    })
    .then(() => {
      res.status(200).json({ message: "Treatment added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "Error adding treatment", err });
    });
};

exports.deleteTreatment = (req, res) => {
  const { id } = req.params;
  db("treatments")
    .where("id", id)
    .del()
    .then(() => {
      res.status(200).json({ message: "Treatment deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "Error deleting treatment", err });
    });
};
