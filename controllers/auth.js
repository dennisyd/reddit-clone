const express = require('express');
const router = express.Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
console.log("Recognizes controller")
  // SIGN UP POST
 router.get("/sign-up", (req, res) => {
    console.log("Went here")
    res.render('sign-up');
  })
  router.post("/sign-up", (req, res) => {
      const user = new User(req.body);

      user.save().then(user => {
          var token = jwt.sign({ _id: user._id}, process.env.SECRET, {expiresIn: "60 days"});
          res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
          res.redirect('/');
      })
      .catch(err => {
          console.log(err.message);
          return res.status(400).send({ err: err});
      });

  });
  router.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
})

router.get('/login', (req, res) => {
    res.render('log-in');
});

router.post("/log-in", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username }, "username password").then(user => {
        if (!user) {
           return res.status(401).send({ message: "Incorrect Credientials" });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
               return res.status(401).send({ message: "Incorrect Credientials" });
            }
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                expiresIn: "60 days"});
                res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
                res.redirect("/");
                console.log(token)
            });
        }).catch(err => {
            console.log(err);
        });
    });

module.exports = router
