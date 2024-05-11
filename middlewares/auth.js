const {getToken} = require("../helpers/auth");

const auth = (req, res, next) => {
    const token = req.headers['auth'];

    if (!token) {
        return res.status(401).json({message: 'Access denied. Token not provided.', status: 401});
    }
    const user = getToken(token);

    if(!user) return res.status(401).json({message: 'Invalid token', status: 401});

    req.user = user;
    next();
};

module.exports = auth;
