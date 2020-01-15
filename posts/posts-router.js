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
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    Posts.findPostComments(id)
        .then(com => {
            if (com.length === 0) {
                res.status(404).json({ message: "The comment with the specified ID does not exist." })
            } else {
                res.status(200).json({com})
            }
        })
        .catch(err => {
            console.log('error getting comment', err)
            res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
        })
})

//GET coments by comment id (findCommentById())
router.get('/:id/comments/:id', (req, res) => {
    const comid = req.params.post_id;
    const id = req.params.id;
    Posts.findCommentById(id)
                    .then(com => {
                        res.status(200).json({com})
                    })
                    .catch(err => {
                        console.log('error getting specified comment', err)
                        res.status(500).json({ errorMessage: "The comments information could not be retrieved by id." })
                    })
    // Posts.findPostComments(postId)
    //     .then(coms => {
    //         if (coms.length === 0) {
    //             res.status(404).json({ message: "The comment with the specified ID does not exist." })
    //         } else {
    //             Posts.findCommentById(id)
    //                 .then(com => {
    //                     res.status(200).json({com})
    //                 })
    //                 .catch(err => {
    //                     console.log('error getting specified comment', err)
    //                     res.status(500).json({ errorMessage: "The comments information could not be retrieved by id." })
    //                 })
    //         }
    //     })
    //     .catch(err => {
    //         console.log('error getting comment', err)
    //         res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
    //     })
      
        
})
//PUT updates post by post id (update())
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatePost = req.body;
    if(!updatePost.title || !updatePost.contents) {
        res.status(400).json( { errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.update(id, updatePost)
            .then(post => {
                if (post) {
                    Posts.findById(id)
                        .then(post => {
                            res.status(200).json(post)
                        })
                        .catch(err => {
                            console.log('error getting this post by its id', err)
                            res.status(404).json({ message: "The post with the specified ID does not exist." })
                        })
                }
            })
            .catch(err => {
                console.log('error updating post', err)
                res.status(500).json({ errorMessage: "The post information could not be modified." })
            })
    }
})

//POST creates a new post using req.body (insert())
router.post('/', (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.insert(newPost)
            .then(newP => {
                res.status(201).json({newP})
            })
            .catch(err => {
                console.log('error creating post', err)
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
})

//POST creates a new comment using req.body (insertComment())
router.post('/:id/comments', (req, res) => {
    
    const newCom = req.body;
    
    Posts.insertComment(newCom)
    const id = req.params.id;
    Posts.findById(id)
        .then(newC => {
            if (newC.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else if (!newCom.text) {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            } else {
                res.status(201).json({newCom})
            }
            
            })
        .catch(err => {
            console.log('error creating new comment', err)
            res.status(500).json({ errorMessage: "There was an error while saving the comment to the database" })
                        })

    // if (!newCom.text) {
    //     res.status(400).json({ errorMessage: "Please provide text for the comment." })
    // } else {
        // Posts.findById(id)
        //     .then(post => {
        //         console.log('got to here')
        //         if (post.length === 0) {
        //             res.status(404).json({ message: "The post with the specified ID does not exist." })
        //         } else if (!newCom.text) {
        //             res.status(400).json({ errorMessage: "Please provide text for the comment." })
        //         } else {
        //             Posts.insertComment(newCom)
        //                 .then(newC => {
        //                     res.status(201).json({newCom})
        //                 })
        //                 .catch(err => {
        //                     console.log('error creating new comment', err)
        //                     res.status(500).json({ errorMessage: "There was an error while saving the comment to the database" })
        //                 })
        //         }
        // })
        // .catch(err => {
        //     console.log('error getting this post', err)
        //     res.status(500).json({ errorMessage: "The post information could not be retrieved." })
        // })
})

//DELETE deletes a post by id (remove())
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    Posts.findById(id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                Posts.remove(id)
                    .then(deleted => {
                        res.status(200).json({message: "Post has been successfully deleted!"})
                    })
                    .catch(err => {
                        console.log('error in delete', err)
                        res.status(500).json({ errorMessage: "The post could not be removed" })
                    })
            }
        })
        .catch(err => {
            console.log('error getting this post', err)
            res.status(500).json({ errorMessage: "The post information could not be retrieved." })
        })
})

module.exports = router;