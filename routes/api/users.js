const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/users");
const loginValidator = require("../../validation/login");
const signupValidator = require("../../validation/signup");
const SECRET = process.env.SECRET;

router.post("/signup", (req, res) => {
  const { value, error } = signupValidator(req.body);
  const { user_name, email, password } = value;
  if (error) return res.status(400).json(error.message);
  User.findOne({ $or: [{ email }, { user_name }] }).then((user) => {
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ email: "user with given email exists" });
      } else {
        return res
          .status(400)
          .json({ user_name: "user with given user_name exists" });
      }
    } else {
      const newUser = new User({ user_name, email, password });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              res.json({
                id: user.id,
                user_name: user.user_name,
              }),
            )
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: "Error creating a new user" });
            });
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { error } = loginValidator(req.body);
  if (error) return res.status(400).send(error.message);
  email = req.body.email;
  password = req.body.password;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: "email not found" });
      }
      hash = user.password;
      bcrypt.compare(password, hash).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            user_name: user.user_name,
          };
          jwt.sign(payload, SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) {
              console.log(err);
            }
            return res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          return res.status(401).send();
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    });
});

module.exports = router;
