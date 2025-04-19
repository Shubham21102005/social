const express= require('express');
const authMiddleware = require('../middleware/authMiddleware')
const {createPost,getAllPost,getSinglePost,deletePost,getComments,comment}= require('../controllers/postControllers')


const router= express.Router();

router.post('/create',authMiddleware,createPost)

router.get('/posts',authMiddleware,getAllPost)

router.get('/post/:id',getSinglePost)

router.delete('/post/:id',authMiddleware,deletePost);

router.get('/post/:id/comments', getComments);  // Get all comments of a post
router.post('/post/:id/comment', authMiddleware, comment);  // Add a comment to a post


module.exports= router