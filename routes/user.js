const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {getSingleUser, updateUser, userFollow} = require("../Controllers/user");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/users');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

router.get('/user/:id', getSingleUser);

router.put('/user/:id', upload.single('profile_pic'), updateUser);

router.post('/user/:userId', userFollow);

module.exports = router;