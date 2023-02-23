const User = require('../models/User');
const Users = require('../models/User');

module.exports = CheckUserLogin = async(req, res, next) => {
    if (!req.session.email) {
        return res.redirect('/user/login')
    } else {
        next();
    }
}