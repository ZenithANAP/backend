let path = require("path");
let fs = require("fs-extra");
const User = require("../models/user");
const router = require("express").Router();
let Donor = require("../models/donor");
let Bank = require("../models/bank");
let Donation = require("../models/donation");
let mongoose = require("mongoose");

router.route("/").get((req, res) => {
  Donor.find()
    .then((donors) => res.json(donors))
    .catch((err) => res.status(400).json("Error: " + err));
});
/*  
https://stackoverflow.com/questions/23691194/node-express-file-upload
*/
router.route("/add1").post((req, res) => {
  // const username = req.body.username;
  let user = req.currentUser;
  console.log(req.body);
  if (user) {
    let username = req.body.username;
    let phone = req.body.phone;
    let aadhar_card = req.body.aadhar_card;
    let address = req.body.address;
    let blood_group = req.body.blood_group;
    let gender = req.body.gender;
    let age = req.body.age;
    let weight = req.body.weight;
    let medical_conditions = req.body.medical_conditions;
    let recovery_date = req.body.recovery_date;
    let toUpdate = {
      username: username,
      phone: phone,
      aadhar_card: aadhar_card,
      address: address,
      blood_group: blood_group,
      gender: gender,
      age: age,
      weight: weight,
      medical_conditions: medical_conditions,
    };
    console.log(toUpdate);
    User.findOneAndUpdate(
      { email: user.email },
      toUpdate,
      { upsert: true },
      function (err, u) {
        if (err) return res.status(500).send(err.message);
        let newDonor = new Donor({
          user: u._id,
          recovery_date: recovery_date,
        });
        newDonor
          .save()
          .then(() => {
            res.json("Donor added !");
            console.log("donor added");
          })
          .catch((err) => {
            // console.log(err.message);
            res.json("dsave error:" + err.message);
          });
      }
    );
  } else {
    res.send("User doesnt exist");
  }
});
router.route("/add2").post((req, res) => {
  let user = req.currentUser;
  // console.log(req.body);
  if (user) {
    let fstream;
    let covid_report = null;
    let medical_report = null;
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, filename) {
      if (fieldname === "covid_report") {
        User.findOneAndUpdate(
          { email: user.email },
          { covid_report: path.join(__dirname, "/../files/", filename) },
          { upsert: true },
          function (err, u) {
            if (err) console.log(err.message);
            console.log("file covid up");
          }
        );
      } else if (fieldname === "medical_report") {
        User.findOneAndUpdate(
          { email: user.email },
          // toUpdate,
          { medical_report: path.join(__dirname, "/../files/", filename) },
          { upsert: true },
          function (err, u) {
            if (err) console.log(err.message);
            console.log("File medical uploaded");
          }
        );
      }
      fstream = fs.createWriteStream(__dirname + "/../files/" + filename);
      file.pipe(fstream);
      fstream.on("close", function () {
        console.log("Upload Finished of " + filename);
      });
    });
  } else {
    res.status(404).send("User doesnt exist");
  }
});

// const getDonationsData = async (donations, res) => {
//   Bank.find(
//     {
//       _id: { $in: donations.to },
//     },
//     (err, banks) => {
//       if (err) {
//         console.log(`Error: ` + err);
//       } else {
//         if (banks.length === 0) {
//           console.log("message");
//         } else {
//           console.log("getDonationsData");
//           res.json({ banks, donations });
//         }
//       }
//     }
//   );
// };

const getDonations = async (donor, res) => {
  Donation.find(
    {
      _id: { $in: donor.donations },
    },
    (err, docs) => {
      if (err) {
        console.log(`Error: ` + err);
      } else {
        if (docs.length === 0) {
          console.log("message");
        } else {
          console.log("found", docs);
        }
        res.send(docs);
        // console.log("calling getDonationsData");
        // getDonationsData(docs, res);
      }
    }
  );
};

router.route("/yourdonations").get((req, res) => {
  const user = req.currentUser;
  if (user) {
    User.findOne({
      email: user.email,
    }).then(async (u) => {
      if (!u) {
        console.log("message");
        res.status(404).send("user not found");
      } else {
        // let ds = [];
        try {
          let donor = await Donor.findOne({ user: u._id });
          await getDonations(donor, res);
          // console.log("2", donations);
          // res.send(donations);
        } catch (error) {
          res.status(404).send("no data found");
        }
      }
    });
  } else {
    res.send("User not logged in");
  }
});
// router.route("/:email").get((req, res) => {
//   const auth = req.currentUser;
//   if (auth) {
//     Donor.find({ email: req.params.email })
//       .then((donor) => res.json(donor))
//       .catch((err) => res.status(400).json("Error: " + err));
//   }
//   return res.status(403).send("Not authorized");
// });
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

// other functions

router.route("/getbankdetails").get((req, res) => {
  const user = req.currentUser;
  if (user) {
    Bank.find(
      {
        // field: filter,
      },
      (err, docs) => {
        // console.log(docs);
        if (err) {
          console.log(`Error: ` + err);
          res.status(500).send("Unexpected error");
        } else {
          if (docs.length === 0) {
            console.log("message");
            res.status(404).send("Banks not found");
          } else {
            res.json(docs);
          }
        }
      }
    );
  } else res.status(401).send("Please login to fetch details");
});

module.exports = router;
