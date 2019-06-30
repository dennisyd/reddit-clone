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
    Post.findById(req.params.id).populate('comments').lean()
        .then(post => {
            res.render("posts-show", { post, currentUser });
        })
        .catch(err => {
            console.log(err.message);
        });
});

// CREATE Comment
 const Comment = require('../models/comment');
 router.post("/:postId/comments", function (req, res) {
        const comment = new Comment(req.body);
        comment.author = req.user._id;
        comment
            .save()
            .then(comment => {
                return Promise.all([
                    Post.findById(req.params.postId)
                ]);
            })
            .then(([post, user]) => {
                post.comments.unshift(comment);
                return Promise.all([
                    post.save()
                ]);
            })
            .then(post => {
                res.redirect(`/posts/${req.params.postId}`);
            })
            .catch(err => {
                console.log(err);
            });
    });

    router.get("/:postId/comments/:commentId/replies/new", (req, res) => {
    let post;
    Post.findById(req.params.postId)
      .then(p => {
        post = p;
        return Comment.findById(req.params.commentId);
      })
      .then(comment => {
        res.render("replies-new", { post, comment });
      })
      .catch(err => {
        console.log(err.message);
      });
  });
  router.get("/:postId/comments/:commentId/replies", (req, res) => {
      console.log("Get replies working....")
      res.redirect(`/posts/${req.params.postId}`);
  })
  // CREATE REPLY
  router.post("/:postId/comments/:commentId/replies", (req, res) => {
    // TURN REPLY INTO A COMMENT OBJECT
    console.log("Replies/new")
    const reply = new Comment(req.body);
    reply.author = req.user._id
    // LOOKUP THE PARENT POST
    Post.findById(req.params.postId)
        .then(post => {
            // FIND THE CHILD COMMENT
            console.log("Comment found")
            Promise.all([
                reply.save(),
                Comment.findById(req.params.commentId),
            ])
                .then(([reply, comment]) => {
                    // ADD THE REPLY
                    comment.comments.unshift(reply._id);

                    return Promise.all([
                        comment.save(),
                    ]);
                })
                .then(() => {
                    res.redirect(`/posts/${req.params.postId}`);
                })
                .catch(console.error);
            // SAVE THE CHANGE TO THE PARENT DOCUMENT
            console.log("Saving reply")
            return post.save();
        })
});

module.exports = router;
