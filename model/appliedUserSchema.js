const mongoose = require("mongoose");

const appliedUserSchema = mongoose.Schema({
  jobSeekerName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  github: {
    required: true,
    type: String,
  },
  jobTitle: {
    require: true,
    type: String,
  },
  userId: {
    require: true,
    type: String,
  },
  organizationName: {
    require: true,
    type: String,
  },
  resume: {
    require: true,
    type: String,
  },
});

const appliedUser = mongoose.model("appliedUser", appliedUserSchema);
module.exports = appliedUser;
