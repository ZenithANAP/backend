let path = require("path");
let fs = require("fs-extra");

const router = require("express").Router();
let Donor = require("../models/donor");

router.route("/").get((req, res) => {
  Donor.find()
    .then((donors) => res.json(donors))
    .catch((err) => res.status(400).json("Error: " + err));
});

/*  
https://stackoverflow.com/questions/23691194/node-express-file-upload
*/

// router.route("/image").post((req, res) => {
//   // console.log(req.body);
//   // console.log(req.busboy);
//   let fstream;
//   let path1 = "";
//   let path2 = "";
//   req.pipe(req.busboy);
//   // let counter = 0;
//   req.busboy.on("file", function (fieldname, file, filename) {
//     // counter++;
//     // console.log(++counter);
//     console.log("Uploading: " + filename);
//     console.log(fieldname);
//     // fieldname is id with which the file is sent from frontend

//     //Path where image will be uploaded
//     if (fieldname == "customFile") {
//       path1 = path.join(__dirname, "/../files/", filename);
//       console.log(path1);
//     } else if (fieldname == "customFile2") {
//       path2 = path.join(__dirname, "/../files/", filename);
//       console.log(path2);
//     }
//     // console.log(path1, path2);
//     fstream = fs.createWriteStream(__dirname + "/../files/" + filename);
//     file.pipe(fstream);
//     fstream.on("close", function () {
//       console.log("Upload Finished of " + filename);
//       // res.redirect("back"); //where to go next
//     });
//   });
//   res.status(201).send("Uploaded");
// });

router.route("/add").post((req, res) => {
  // const username = req.body.username;
  let user = req.currentUser;
  if (user) {
    // const firebase_id = req.body.firebase_id;
    const username = req.body.username;
    // const email = req.body.email;
    const phone = req.body.phone;
    const aadhar_card = req.body.aadhar_card;
    const address = req.body.address;
    const blood_group = req.body.blood_group;
    const gender = req.body.gender;
    const age = req.body.age;
    const weight = req.body.weight;
    const medical_conditions = req.body.medical_conditions;
    const recovery_date = req.body.recovery_date;
    let fstream;
    let covid_report = "";
    let medical_report = "";
    req.pipe(req.busboy);
    // let counter = 0;
    req.busboy.on("file", function (fieldname, file, filename) {
      // counter++;
      // console.log(++counter);
      console.log("Uploading: " + filename);
      console.log(fieldname);
      // fieldname is id with which the file is sent from frontend

      //Path where image will be uploaded
      if (fieldname == "customFile") {
        covid_report = path.join(__dirname, "/../files/", filename);
        console.log(covid_report);
      } else if (fieldname == "customFile2") {
        medical_report = path.join(__dirname, "/../files/", filename);
        console.log();
      }
      // console.log(path1, path2);
      fstream = fs.createWriteStream(__dirname + "/../files/" + filename);
      file.pipe(fstream);
      fstream.on("close", function () {
        console.log("Upload Finished of " + filename);
        // res.redirect("back"); //where to go next
      });
    });
    User.findOne({ email: user.email })
      .then((u) => {
        u.username = username;
        u.phone = phone;
        u.aadhar_card = aadhar_card;
        u.address = address;
        u.blood_group = blood_group;
        u.gender = gender;
        u.age = age;
        u.weight = weight;
        u.medical_conditions = medical_conditions;
        u.medical_report = medical_report;
        u.covid_report = covid_report;

        // let fstream;
        // req.pipe(req.busboy);
        // req.busboy.on("file", function (medical_report, file, medical_report) {
        //   console.log("Uploading: " + medical_report);

        //   //Path where image will be uploaded
        //   fstream = fs.createWriteStream(
        //     __dirname + "/files/" + medical_report
        //   );
        //   file.pipe(fstream);
        //   fstream.on("close", function () {
        //     console.log("Upload Finished of " + filename);
        //     // res.redirect("back"); //where to go next
        //   });
        // });

        u.save(function (err) {
          if (!err) {
            res.send("User data saved");
          } else {
            res.send("Error:" + err);
          }
        });
        let newDonor = new Donor({ user: u._id, recovery_date: recovery_date });
        newDonor
          .save()
          .then(() => res.json("Donor added !"))
          .catch((err) => res.json("error:" + err));
      })
      .catch((err) => {
        res.send("Error:" + err);
      });
  } else {
    res.send("User doesnt exist");
  }
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
