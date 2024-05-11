const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require("../configs/db");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/users');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    const query = 'SELECT * FROM user WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({message: 'Error fetching user', status: 500});
        }

        if (results.length === 0) {
            return res.status(404).send({message: 'User not found', status: 404});
        }

        res.json(results[0]);
    });
});

router.put('/user/:id', upload.single('profile_pic'), (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, contact, user_name, bio } = req.body;
    let profile_pic;

    if (req.file) {
        profile_pic = req.file.filename;
    }

    let query = 'UPDATE user SET ';
    const queryParams = [];

    if (first_name) {
        query += 'first_name = ?, ';
        queryParams.push(first_name);
    }
    if (last_name) {
        query += 'last_name = ?, ';
        queryParams.push(last_name);
    }
    if (email) {
        query += 'email = ?, ';
        queryParams.push(email);
    }
    if (contact) {
        query += 'contact = ?, ';
        queryParams.push(contact);
    }
    if (user_name) {
        query += 'user_name = ?, ';
        queryParams.push(user_name);
    }
    if (bio) {
        query += 'bio = ?, ';
        queryParams.push(bio);
    }
    if (profile_pic) {
        query += 'profile_pic = ?, ';
        queryParams.push(profile_pic);
    }

    query = query.slice(0, -2);

    query += ' WHERE id = ?';
    queryParams.push(userId);

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({message: 'Error updating user', status: 500});
        }

        res.status(200).json({message: 'User updated successfully', status: 200});
    });
});

router.post('/user/follow/:userId', (req, res) => {
    const followerId = 1;
    const followedId = req.params.userId;

    db.query('SELECT * FROM user_follower WHERE follower_id = ? AND user_id = ?', [followerId, followedId], (error, results, fields) => {
        if (error) {
            console.error('Error checking follow relationship:', error);
            res.status(500).json({ message: 'Error checking follow relationship', status: 500 });
            return;
        }

        if (results.length > 0) {
            res.status(400).json({ message: 'Already followed', status: 400 });
            return;
        }

        db.query('INSERT INTO user_follower (follower_id, user_id) VALUES (?, ?)', [followerId, followedId], (insertError, insertResults, insertFields) => {
            if (insertError) {
                console.error('Error following user:', insertError);
                res.status(500).json({ message: 'Error following user', status: 500 });
                return;
            }
            res.json({ success: true });
        });
    });
});

router.post('/user/unfollow/:userId', (req, res) => {
    const followerId = 1;
    const followedId = req.params.userId;

    db.query('SELECT * FROM user_follower WHERE follower_id = ? AND user_id = ?', [followerId, followedId], (error, results, fields) => {
        if (error) {
            console.error('Error checking follow relationship:', error);
            res.status(500).json({ message: 'Error checking follow relationship', status: 500 });
            return;
        }

        if (results.length === 0) {
            res.status(400).json({ message: 'Not followed',status: 400 });
            return;
        }

        db.query('DELETE FROM user_follower WHERE follower_id = ? AND user_id = ?', [followerId, followedId], (deleteError, deleteResults, deleteFields) => {
            if (deleteError) {
                console.error('Error unfollowing user:', deleteError);
                res.status(500).json({ message: 'Error unfollowing user' , status: 500});
                return;
            }
            res.json({ message: "Unfollowed successfully", status: 200 });
        });
    });
});

module.exports = router;