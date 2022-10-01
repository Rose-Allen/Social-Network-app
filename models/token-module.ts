const { Schema, model } = require("mongoose");

const tokenModel = new Schema({
  user: {
    type: Number,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = model("Token", tokenModel);
