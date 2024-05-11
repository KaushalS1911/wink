const express = require("express");
const router = express.Router();
const db = require("../configs/db");

router.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    const query = 'SELECT * FROM user WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error fetching user');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(results[0]);
    });
});

module.exports = router;