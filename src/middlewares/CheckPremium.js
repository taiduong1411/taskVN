const Users = require('../models/User')

module.exports = CheckPremium = async(req, res, next) => {
    await Users.findOne({ email: req.session.email || req.user.email }).then(user => {
        if (!user) {
            return res.redirect('/user/login')
        } else {
            if (user.isPremium == false) {
                return res.redirect('/payment/payment')
            } else {
                next();
            }
        }
    })
}