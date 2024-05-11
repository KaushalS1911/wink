const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../configs/db');
const {postImage} = require('../helpers/upload');
const {addPost, allPosts, likePosts} = require("../Controllers/post");

const upload = multer({ storage: postImage });

// Create post
router.post('/post', upload.single('image'), addPost);

// All posts
router.get('/post', allPosts);

// Like / Dislike a post
router.post('/post/:postId', likePosts);



module.exports = router;
