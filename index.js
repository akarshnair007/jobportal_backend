//require dotenv
require("dotenv").config();

// require express
const express = require("express");

// require cors
const cors = require("cors");

//require router
const router = require("./router");

require("./db/connection");

//create server
const jobPortalServer = express();

//using cors to connect server with frontend
jobPortalServer.use(cors());

//json() - middleware - to convert json format
jobPortalServer.use(express.json());

//server use router
jobPortalServer.use(router);

jobPortalServer.use("/uploads", express.static("./uploads"));

jobPortalServer.get("/", (req, res) => {
  res.send("GET request received");
});

const PORT = 3000 || process.env.PORT;

jobPortalServer.listen(PORT, () => {
  console.log(`The server is running successfully at ${PORT}`);
});
