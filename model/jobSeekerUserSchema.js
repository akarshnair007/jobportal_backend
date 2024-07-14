const mongoose = require("mongoose");

const jobSeekerUserSchema = mongoose.Schema({
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
  github: {
    require: true,
    type: String,
  },
  experience: {
    require: true,

    type: String,
  },
  profile: {
    type: String,
  },
  resume: {
    require: true,
    type: String,
  },
});

const jobseekers = mongoose.model("jobseekers", jobSeekerUserSchema);
module.exports = jobseekers;
