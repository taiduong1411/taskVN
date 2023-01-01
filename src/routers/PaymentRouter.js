const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController')
const CheckUserLogin = require('../middlewares/CheckUserLogin')

router.get('/payment', CheckUserLogin, PaymentController.getPayment)


module.exports = router;