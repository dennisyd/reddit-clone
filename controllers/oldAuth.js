const jwt = require('jsonwebtoken');
const express = require('express');
const User = require("../models/user");
const router = express.Router();

const app = express()
  // SIGN UP POST
 module.exports = (app) => {

  app.get("/sign-up", (req, res) => {
    res.render('sign-up');
  });

  app.post('/sign-up', (req, res) => {
    const user = new User(req.body);
    console.log(req.params)
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

  app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
})

app.get('/login', (req, res) => {
    res.render('log-in');
});

app.post("/login", (req, res) => {
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

}
