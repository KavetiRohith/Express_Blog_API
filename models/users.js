const mongoose = require('mongoose');

const users = mongoose.model('users',new mongoose.Schema({
  user_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}));

module.exports = users;