const express = require('express');
const router = express.Router();

const CheckPremium = require('../middlewares/CheckPremium')
const UserControllers = require('../controllers/UserController')

function isLog(req, res, next) {
    if (req.user || req.session.email) {
        next()
    } else {
        return res.redirect('/user/login')
    }
}


router.get('/register', UserControllers.getRegister)
router.get('/login', UserControllers.getLogin)

router.get('/logout', UserControllers.getLogout)
router.get('/forgot-password', UserControllers.getForgotPassword)
router.get('/send-code', UserControllers.getSendCode)
router.get('/verify-code', UserControllers.getVerifyCode)
router.get('/forgot-password-reset', UserControllers.getForgotPasswordReset)
router.get('/my-profile', isLog, UserControllers.getProfile)



router.post('/register', UserControllers.postRegister)
router.post('/login', UserControllers.postLogin)
router.post('/forgot-password', UserControllers.postForgotPassword)
router.post('/forgot-password-reset', UserControllers.postForgotPasswordReset)
router.post('/verify-code', UserControllers.postVerifyCode)
router.post('/send-code', UserControllers.postSendCode)


module.exports = router