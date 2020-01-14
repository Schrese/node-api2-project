const router = require('express').Router();

const Posts = require('../data/db.js');
//this is for all calls using "/api/posts"

//GET all posts (find())
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(201).json(posts)
        })
        .catch(err => {
            console.log('error getting posts', err)
            res.status(500).json({ errorMessage: "Please provide title and contents for the post." })
        })
})

//GET posts by id (findById())
router.get('/:id', (req, res) => {
    const id = req.params.id;
    
    Posts.findById(id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json({post})
            }
        })
        .catch(err => {
            console.log('error getting this post', err)
            res.status(500).json({ errorMessage: "The post information could not be retrieved." })
        })
})

//GET all comments of post by post id (findPostComments())

//GET coments by comment id (findCommentById())

//PUT updates post by post id (update())

//POST creates a new post using req.body (insert())

//POST creates a new comment using req.body (insertComment())

//DELETE deletes a post by id (remove())

module.exports = router;