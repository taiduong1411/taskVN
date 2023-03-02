const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController')
const CheckUserLogin = require('../middlewares/CheckUserLogin')

function isLog(req, res, next) {
    if (req.user || req.session.email) {
        next()
    } else {
        return res.redirect('/user/login')
    }
}
router.get('/payment', isLog, PaymentController.getPayment)


module.exports = router;