const express = require('express');
const User = require("../models/user");
const router = express.Router();
const jwt = require('jsonwebtoken');
  // SIGN UP POST
 router.get("/", (req, res) => {
    res.render('sign-up');
  });
  router.post("/", (req, res) => {
    // Create User
    const user = new User(req.body);

    user
      .save()
      .then(user => {
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).send({ err: err });
      });
  });
module.exports = router
