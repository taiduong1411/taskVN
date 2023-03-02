// const User = require('../models/User');
// const Users = require('../models/User');
const passport = require('passport')

module.exports = CheckUserLogin = async(req, res, next) => {
    if (!req.session.email || !req.user) {
        return res.redirect('/user/login')
    } else {
        next();
    }
}