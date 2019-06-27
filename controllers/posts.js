const express = require('express');

const router = express.Router();

const Post = require('../models/post');

router.get('/',(req,res) => {
   // const post = new Post(req.body);
   //
   // post.save()

   Post.find({})
   .then(posts => {
   	res.render('posts-index', { posts });
   })
   .catch(err => {
   	console.log(err.message);
   })
})

router.get('/new',(req,res) => {
   res.render('posts-new')
})
router.post('/new', (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    const post = new Post(req.body);
    console.log("Saving...")
    // SAVE INSTANCE OF POST MODEL TO DB
    post.save((err, post) => {
      // REDIRECT TO THE ROOT
      return res.redirect(`/`);
    })
  });

router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate('comments').then((post) => {
  res.render('posts-show', { post })
}).catch((err) => {
  console.log(err.message)
})
})

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
