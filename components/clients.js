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

exports.allClients = (req, res) => {
  db.select("*")
    .from("clients")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.json({ message: "Error getting clients", err });
      console.log(err);
    });
};

exports.someClients = (req, res) => {
  const { query, limit, offset } = req.params;

  if (query === "null") {
    db.select("*")
      .from("clients")
      .limit(limit)
      .offset(offset)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.json({ message: "Error getting clients", err });
        console.log(err);
      });
  } else {
    db.select("*")
      .from("clients")
      .limit(limit)
      .offset(offset)
      .whereILike("name", `%${query}%`)
      .orWhereILike("lastname", `%${query}%`)
      .orWhereILike("mail", `%${query}%`)
      .orWhereILike("phone", `%${query}%`)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.json({ message: "Error getting clients", err });
        console.log(err);
      });
  }
};

exports.addClient = (req, res) => {
  const client = {
    name: req.body.name,
    lastname: req.body.lastname,
    birth: req.body.birth,
    phone: req.body.phone,
    mail: req.body.mail,
  };

  db("clients")
    .insert(client)
    .then(() => {
      res.status(201).json({ message: "Client added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error adding client", err });
      console.log(err);
    });
};

exports.Client = (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("clients")
    .where("id", id)
    .then((data) => {
      res.status(200).json(data[0]);
    })
    .catch((err) => {
      res.json({ message: "Error getting client", err });
      console.log(err);
    });
};
