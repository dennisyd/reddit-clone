require('dotenv').config();
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const express = require('express')
const expressValidator = require('express-validator');
const app = express()
const posts = require('./controllers/posts');
const comments = require('./controllers/comments.js')(app);
const theauth = require('./controllers/auth');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// Set db
require('./data/reddit-db');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(cookieParser());

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
    console.log("Bad Auth")
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    console.log("Good Auth")
    console.log(decodedToken.payload)
    req.user = decodedToken.payload;
    currentUser = req.user
  }

  next();
};
app.use(checkAuth);
const Post = require('./models/post');


app.get("/n/:subreddit", function(req, res) {
  Post.find({ subreddit: req.params.subreddit })
    .then(posts => {
      res.render("posts-index", { posts });
    })
    .catch(err => {
      console.log(err);
    });
});
app.get("/", (req, res) => {
  var currentUser = req.user;
  console.log(currentUser)
  Post.find({})
    .then(posts => {
      res.render("posts-index", { posts, currentUser });
    })
    .catch(err => {
      console.log(err.message);
    });
});


app.use('/a', theauth)

app.use('/posts', posts)

app.listen(3000, () => {
    console.log('App listening on port 3000!')
})
module.exports = app;
