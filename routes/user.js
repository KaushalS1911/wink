const express = require("express");
const router = express.Router();
const multer = require('multer');
const {userAvatar} = require('../helpers/upload');
const {getSingleUser, updateUser, userFollow} = require("../Controllers/user");

const upload = multer({ storage: userAvatar });

router.get('/user/:id', getSingleUser);

router.put('/user/:id', upload.single('profile_pic'), updateUser);

router.post('/user/:userId', userFollow);

module.exports = router;