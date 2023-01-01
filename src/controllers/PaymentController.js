const express = require('express');
const UserAPI = require('../APIs/UserAPI');
const User = require('../models/User')
const PaymentController = {
    getPayment: async(req, res, next) => {
        let user = await UserAPI.getOne({ email: req.session.email })
        return res.render('payment/payment', {
            avatar: user.avatar,
            fullName: user.fullName
        })
    }
}
module.exports = PaymentController