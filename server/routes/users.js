const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const _ = require("lodash");
const Joi = require("joi");
const { User, validateUser, validateLogin } = require("../models/user"); // Corrected import
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  user = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
  });
  try {
    await user.save();
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.jwtPrivateKey
    );
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body); // Corrected function name
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user) return res.status(400).send("User already logged in!"); // You probably want to return a status of 400 Bad Request here

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.jwtPrivateKey
  );
  res.send(token); // Send the token directly, no need to set it in headers
});

router.post("/logout", async (req, res) => {
  // Implement logout logic here
});

module.exports = router;
