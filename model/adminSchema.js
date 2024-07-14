const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

const admins = mongoose.model("admins", adminSchema);
module.exports = admins;
