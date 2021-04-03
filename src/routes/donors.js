const router = require("express").Router();
let Donor = require("../models/donor");

router.route("/").get((req, res) => {
  Donor.find()
    .then((donors) => res.json(donors))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  // const username = req.body.username;

  const firebase_id = req.body.firebase_id;
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const aadhar_card = req.body.aadhar_card;
  const address = req.body.address;
  const blood_group = req.body.blood_group;
  const gender = req.body.gender;
  const age = req.body.age;
  const weight = req.body.weight;
  const medical_conditions = req.body.medical_conditions;

  // covid_report: {
  //   data: Buffer,
  //   contentType: String,
  // },
  // medical_report: {
  //   data: Buffer,
  //   contentType: String,
  // },
});

router.route("/:email").get((req, res) => {
  const auth = req.currentUser;
  if (auth) {
    Donor.find({ email: req.params.email })
      .then((donor) => res.json(donor))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  return res.status(403).send("Not authorized");
});
// router.route("/:id").delete((req, res) => {
//   User.findByIdAndDelete(req.params.id)
//     .then(() => res.json("User deleted."))
//     .catch((err) => res.status(400).json("Error: " + err));
// });
// router.route("/update/:id").post((req, res) => {
//   User.findById(req.params.id)
//     .then((user) => {
//       user.username = req.body.username;
//       user
//         .save()
//         .then(() => res.json("User updated!"))
//         .catch((err) => res.status(400).json("Error: " + err));
//     })
//     .catch((err) => res.status(400).json("Error: " + err));
// });
module.exports = router;
