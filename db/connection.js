const mongoose = require("mongoose");

const connectionString = process.env.DATABASE;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("MongoDB Conencted Successfully");
  })
  .catch((error) => console.log(error));
