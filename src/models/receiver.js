const mongoose = require("mongoose");
// const extendSchema = require("mongoose-extend-schema");
const { userSchema } = require("./user.js");
const receiverSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  donation_received: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    },
  ],
});
const Receiver = mongoose.model("Receiver", receiverSchema);

module.exports = Receiver;

//   received_data: {
//     received_id: {
//       when: datetime
//       test_reports: image
//       used: [
//         {
//           of:
//           bank_id:
//           quantity:
//         }
//       ]
//     }
//   }
