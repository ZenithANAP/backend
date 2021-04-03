const mongoose = require("mongoose");
// const extendSchema = require("mongoose-extend-schema");
const { userSchema } = require("./user.js");
const donorSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  last_donation: {
    type: Date,
  },
  recovery_date: {
    type: Date,
  },
  donations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    },
  ],
});
const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;

//   last_donation: datetime
//   recory_date: date
//   donations: {
//     donation_id: {
//       when: datetime
//       used: [
//         {
//           by:
//           bank_id:
//           quantity:
//         },
//       ]
//     }
