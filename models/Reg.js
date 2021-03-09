const mongoose = require("mongoose");

const RegSchema = new mongoose.Schema({
  regNo : {
      type : Number,
      required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Reg", RegSchema);