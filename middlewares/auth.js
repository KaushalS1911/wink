const {getToken} = require("../helpers/auth");

const auth = (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) {
        return res.status(401).json({message: 'Access denied. Token not provided.', status: 401});
    }

    try {
        req.user = getToken();
        next();
    } catch (error) {
        return res.status(400).json({message: 'Invalid token.', status: 400});
    }
};

module.exports = auth;
