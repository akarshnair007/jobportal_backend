const mongoose = require("mongoose");

const recruiterUserSchema = mongoose.Schema({
  username: {
    require: true,
    type: String,
  },
  email: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  organizationName: {
    require: true,
    type: String,
  },
});

const recruiters = mongoose.model("recruiters", recruiterUserSchema);
module.exports = recruiters;
