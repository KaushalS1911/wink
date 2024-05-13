const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../configs/db');
const path = require("path")
const {addPost, allPosts, likePosts} = require("../Controllers/post");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create post
router.post('/post', upload.single('image'), addPost);

// All posts
router.get('/post', allPosts);

// Like / Dislike a post
router.post('/post/:postId', likePosts);



module.exports = router;
