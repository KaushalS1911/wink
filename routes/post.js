const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../configs/db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/post', upload.single('image'), (req, res) => {
    const { posted_by, caption, description} = req.body;
    const image = req.file.filename;

    if ( !image || !caption || !description) {
        return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO post (posted_by, post_image, caption, description, posted_on) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [posted_by, image, caption, description, new Date()], (err, result) => {
        if (err) {
            console.error('Error adding new post:', err);
            return res.status(500).send('Error adding new post');
        }

        res.status(201).send('Post added successfully');
    });
});

module.exports = router;
