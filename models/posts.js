const mongoose = require("mongoose");

const posts = mongoose.model(
  "posts",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }),
);

module.exports = posts;
