const express = require('express');

const router = express.Router();
const User = require("../models/user");
const Post = require('../models/post');
router.get('/', (req, res) => {
        var currentUser = req.user;
        // res.render('home', {});
        console.log(req.cookies);
        Post.find().populate('author')
        .then(posts => {
            res.render('posts-index', { posts, currentUser });
            // res.render('home', {});
        }).catch(err => {
            console.log(err.message);
        })
    })

router.get('/new',(req,res) => {
   res.render('posts-new')
})
router.post("/new", (req, res) => {
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id;

            post
                .save()
                .then(post => {
                    return User.findById(req.user._id);
                })
                .then(user => {
                    user.posts.unshift(post);
                    user.save();
                    // REDIRECT TO THE NEW POST
                    res.redirect(`/posts/${post._id}`);
                })
                .catch(err => {
                    console.log(err.message);
                });
        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });

router.get("/:id", function (req, res) {
        var currentUser = req.user;
        // LOOK UP THE POST

        Post.findById(req.params.id).populate('comments').populate('author')
            .then(post => {
                res.render("posts-show", { post, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });

// CREATE Comment
 const Comment = require('../models/comment');
 router.post("/:postId/comments", function(req, res) {
   // INSTANTIATE INSTANCE OF MODEL
   const comment = new Comment(req.body);

   // SAVE INSTANCE OF Comment MODEL TO DB
   comment
     .save()
     .then(comment => {
       return Post.findById(req.params.postId);
     })
     .then(post => {
       post.comments.unshift(comment);
       return post.save();
     })
     .then(post => {
       res.redirect(`/`);
     })
     .catch(err => {
       console.log(err);
     });
 });

module.exports = router;
