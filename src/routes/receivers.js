let path = require("path");
let fs = require("fs-extra");
const User = require("../models/user");
const router = require("express").Router();
let Receiver = require("../models/receiver");

router.route("/").get((req, res) => {
  Receiver.find()
    .then((receivers) => res.json(receivers))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add1").post((req, res) => {
  let user = req.currentUser;
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
        let newReceiver = new Receiver({
          user: u._id,
          // recovery_date: recovery_date,
        });
        newReceiver
          .save()
          .then(() => {
            res.json("Receiver added !");
            console.log("receiver added");
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
  // const username = req.body.username;
  let user = req.currentUser;

  console.log(req.body);
  if (user) {
    let fstream;
    let covid_report = null;
    let medical_report = null;
    // let toUpdate = {
    //   medical_report: medical_report,
    //   covid_report: covid_report,
    // };
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, filename) {
      // console.log("Uploading: " + filename);
      // console.log(fieldname);
      // fieldname is id with which the file is sent from frontend

      //Path where image will be uploaded
      // toUpdate = {
      //   medical_report: null,
      //   covid_report: null,
      // };
      if (fieldname === "covid_report") {
        // covid_report = filename;
        User.findOneAndUpdate(
          { email: user.email },
          // toUpdate,
          { covid_report: path.join(__dirname, "/../files/", filename) },
          { upsert: true },
          function (err, u) {
            if (err) console.log(err.message);
            // res.send("Uploaded files");
            console.log("file covid up");
          }
        );

        // toUpdate["covid_report"] = filename;
        // console.log("1", toUpdate);
        // console.log("Covid report Path: ", covid_report);
      } else if (fieldname === "medical_report") {
        // medical_report = path.join(__dirname, "/../files/", filename);

        User.findOneAndUpdate(
          { email: user.email },
          // toUpdate,
          { medical_report: path.join(__dirname, "/../files/", filename) },
          { upsert: true },
          function (err, u) {
            if (err) console.log(err.message);
            // res.send("Uploaded files");
            console.log("File medical uploaded");
          }
        );
        // toUpdate["medical_report"] = filename;
        // console.log("Medical report Path: ", medical_report);
        // console.log("2", toUpdate);
      }
      fstream = fs.createWriteStream(__dirname + "/../files/" + filename);
      file.pipe(fstream);
      fstream.on("close", function () {
        console.log("Upload Finished of " + filename);
      });
    });

    // console.log("3", toUpdate);
  } else {
    res.send("User doesnt exist");
  }
});

router.route("/:email").get((req, res) => {
  const auth = req.currentUser;
  if (auth) {
    Receiver.find({ email: req.params.email })
      .then((receiver) => res.json(receiver))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  return res.status(403).send("Not authorized");
});

module.exports = router;
