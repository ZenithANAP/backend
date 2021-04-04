const mongoose = require("mongoose");
// import mongoose from "mongoose";

const bankSchema = mongoose.Schema({
  name: {
    type: String,
    //   min:0,
  },

  city: {
    type: String,
    // ref: "B_bank",
  },
  availability: {
    "A+": { type: Number },
    "B+": { type: Number },
    "AB+": { type: Number },
    "O+": { type: Number },
    "A-": { type: Number },
    "O-": { type: Number },
    "B-": { type: Number },
    "AB-": { type: Number },
  },
  contact:{
      type:String,
  }
});
const Bank = mongoose.model("Bank", bankSchema);

module.exports = Bank;
