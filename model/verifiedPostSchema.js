const mongoose = require("mongoose");

const verifiedPostSchema = mongoose.Schema({
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

const verifiedPosts = mongoose.model("verifiedPosts", verifiedPostSchema);

module.exports = verifiedPosts;
