const mongoose = require("mongoose");
// const extendSchema = require("mongoose-extend-schema");
// const { userSchema } = require("./user.js");
const donationSchema = mongoose.Schema({
  amount: {
    type: Number,
    min: 0,
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
  },
  time: {
    type: Date,
  },
});
const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
