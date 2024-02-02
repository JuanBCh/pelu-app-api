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
  const admin = req.admin;
  console.log(admin);

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
    name: req.body.name ? req.body.name : undefined,
    lastname: req.body.lastname ? req.body.lastname : undefined,
    birth: req.body.birth ? req.body.birth : undefined,
    phone: req.body.phone ? req.body.phone : undefined,
    mail: req.body.mail ? req.body.mail : undefined,
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

exports.editClient = (req, res) => {
  const { id } = req.params;
  const client = {
    name: req.body.name ? req.body.name : undefined,
    lastname: req.body.lastname ? req.body.lastname : undefined,
    birth: req.body.birth ? req.body.birth : undefined,
    phone: req.body.phone ? req.body.phone : undefined,
    mail: req.body.mail ? req.body.mail : undefined,
  };

  db("clients")
    .where("id", id)
    .update(client)
    .then(() => {
      res.status(202).json({ message: "Client edited successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error editing client", err });
      console.log(err);
    });
};

exports.deleteClient = (req, res) => {
  const { id } = req.params;

  db("clients")
    .where("id", id)
    .del()
    .then(() => {
      res.status(200).json({ message: "Client deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting client", err });
      console.log(err);
    });
};
