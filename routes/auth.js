const {setToken} = require("../helpers/auth");
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../configs/db');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, contact, user_name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO user (first_name, last_name, email, contact, user_name, password ) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, contact, user_name, hashedPassword],
        (err, result) => {
            if (err) {
                console.error('Error registering user: ' + err);
                res.status(500).json({message: 'Error registering user', status: 500});
            } else {
                res.status(200).send({message: 'User registered successfully', status: 200, data: result[0]});
            }
        }
    );
});

router.post('/login', async (req, res) => {
    const { user_name, password } = req.body;

    db.query(
        'SELECT * FROM user WHERE user_name = ?',
        [user_name],
        async (err, result) => {
            if (err) {
                console.error('Error logging in: ' + err);
                res.status(500).json({message: 'Error logging in', status: 500});
            } else if (result.length === 0) {
                res.status(401).json({message: 'Invalid username or password', status: 401});
            } else {
                const match = await bcrypt.compare(password, result[0].password);
                const {id, user_name} = result[0];
                if (match) {
                    const {password, ...user} = result[0];
                    const auth_token = setToken({id, user_name});
                    res.status(200).json({message: 'Login successful', status: 200, data: user, token: auth_token});
                } else {
                    res.status(401).send({message: 'Invalid username or password', status: 401});
                }
            }
        }
    );
});

module.exports = router;
