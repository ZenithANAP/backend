const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// user = {
//   uid: string
//   email: string
//   phone: tel
//   aadhaar_card: number
//   address: string
//   user_type: enum(donor, receiver)
//   blood_group: enum
//   plasma_type: ?
//   gender: enum
//   medical_conditions: select[]
//   age: number
//   weight: number
//   medical_report:
//   covid_report: image

// blood_bank = {
//   id: string
//   bank_name: string
//   location: string
//   types: {
//     a+: {
//       available: quantity
//     }
//   }
// }
const userSchema = new Schema(
  {
    firebase_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    username: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    phone: {
      type: String,
      // required: true,
      // unique: true,
      trim: true,
    },
    aadhar_card: {
      type: String,
      // required: true,
      trim: true,
    },
    address: {
      type: String,
      // required: true,
      trim: true,
    },
    blood_group: {
      type: String,
      enum: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
      default: "AB+",
      // required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
      default: "M",
      // required: true,
    },
    medical_conditions: {
      type: [String],
      // required: true,
      // trim: true,
    },
    age: {
      type: Number,
      // required: true,
      min: 0,
    },
    weight: {
      type: Number,
      // required: true,
      min: 0,
    },
    covid_report: {
      data: Buffer,
      contentType: String,
    },
    medical_report: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
