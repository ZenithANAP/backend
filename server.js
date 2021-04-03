const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const donorsRouter = require("./src/routes/donors");
const decodeIDToken = require("./authenticateToken");
let Donor = require("./src/models/donor");
let User = require("./src/models/user");
// let User = mongoose.model("user");
let Receiver = require("./src/models/receiver");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(decodeIDToken);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/greet", (req, res) => {
  res.json({
    greet: "Heyyy",
  });
});
app.use("/register", (req, res) => {
  const user = req.currentUser;
  if (user) {
    let firebase_id = user.uid;
    let email = user.email;
    let type = req.body.type;

    console.log(req.body);

    const newUser = new User({
      firebase_id: firebase_id,
      email: email,
      type: type,
    });

    newUser
      .save()
      .then(() => res.json("User added!"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

app.use("/getType", (req, res) => {
  const user = req.currentUser;
  if (user) {
    console.log(user.email);
    User.find({ email: user.email }).then((u) => {
      let type = u.map((doc) => doc.type);
      console.log(type[0]);
      let hasData = false;
      if (u.username) {
        hasData = true;
      }
      res.json({ type: type[0], hasData: hasData });
    });
    // res.send("User created");
  } else {
    res.send("Not logged in");
  }
});
// app.use("/donors", donorsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
