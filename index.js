const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.DB_PORT || 8080;

app.use(cors());
app.use(express.json());

const {
  someClients,
  addClient,
  allClients,
  Client,
  editClient,
} = require("./components/clients");
const {
  clientTreatments,
  addTreatment,
  deleteTreatment,
} = require("./components/treatments");

//CLIENTS
app.get("/getClients/:query/:limit/:offset", someClients);
app.get("/allClients", allClients);
app.get("/client/:id", Client);

app.post("/addClient", addClient);

app.patch("/updateClient/:id", editClient);

//TREATMENTS
app.get("/clientTreatments/:id", clientTreatments);

app.post("/addTreatment", addTreatment);

app.delete("/deleteTreatment/:id", deleteTreatment);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
