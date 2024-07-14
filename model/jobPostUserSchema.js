const mongoose = require("mongoose");

const jobPostUserSchema = mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  experience: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  organizationName: {
    required: true,
    type: String,
  },
});

const jobPost = mongoose.model("jobPost", jobPostUserSchema);
module.exports = jobPost;
