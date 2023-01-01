const Users = require('../models/User');

module.exports = CheckUserLogin = async(req, res, next) => {
    if (!req.session.email) {
        return res.redirect('/user/login')
    } else if (req.session.level == 'Customer' || req.session.level == 'Admin') {
        next();
    } else {
        await req.session.destroy();
        return res.redirect('/user/login')
    }
}