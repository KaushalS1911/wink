const multer = require("multer");
const path = require('path');

const userAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/users');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const postImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

module.exports = {userAvatar, postImage};