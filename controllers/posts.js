const express = require('express');

const router = express.Router();

const Post = require('../models/post');

router.get('/',(req,res) => {
   const post = new Post(req.body);

   post.save()

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
	Post.findById(req.params.id)
	.then(post => {
		res.render('posts-show', { post });
	})
	.catch(err => {
		console.log(err.message);
	})
})

module.exports = router;
