const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fs = require("fs");
const userList = require("./models/userList");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/protected", async (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

app.post("/createAccount", async (req, res) => {
  try {
    const { username, password } = req.body;
    const saltType = 10;
    const hashedPassword = await bcrypt.hash(password, saltType);
    const date = new Date();
    const options = {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    const adduser = {
      username: username,
      password: hashedPassword,
      createdAt: new Intl.DateTimeFormat("en-GB", options).format(date),
    };
    const result = await userList.create(adduser);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while creating the account",
      error: err,
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
