const jwt = require("jsonwebtoken")
const secret = "THisissecret"

function setToken(user) {
    return jwt.sign(user,secret)
}

function getToken(auth_token) {
   return jwt.verify(auth_token,secret)
}

module.exports = {setToken, getToken};