const express = require('express');
const router = express.Router();
const CheckPremium = require('../middlewares/CheckPremium')
const GroupTaskController = require('../controllers/GroupTaskController')

function isLog(req, res, next) {
    if (req.user || req.session.email) {
        next()
    } else {
        return res.redirect('/user/login')
    }
}


// router.get('/company/company', isLog, CheckPremium, GroupTaskController.getCompanyTask)
router.get('/group/group-task', isLog, CheckPremium, GroupTaskController.getGroupTask)
router.get('/group/create', isLog, CheckPremium, GroupTaskController.getGroupCreate)


router.post('/group/create', isLog, CheckPremium, GroupTaskController.postGroupCreate)

module.exports = router