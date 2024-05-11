require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const PORT = process.env.PORT || 9000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
