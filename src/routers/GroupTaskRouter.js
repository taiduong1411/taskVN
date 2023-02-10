const express = require('express');
const router = express.Router();
const CheckUserLogin = require('../middlewares/CheckUserLogin')
const CheckPremium = require('../middlewares/CheckPremium')
const GroupTaskController = require('../controllers/GroupTaskController')

// router.get('/company/company', CheckUserLogin, CheckPremium, GroupTaskController.getCompanyTask)
router.get('/group/group-task', CheckUserLogin, CheckPremium, GroupTaskController.getGroupTask)
router.get('/group/create', CheckUserLogin, CheckPremium, GroupTaskController.getGroupCreate)


router.post('/group/create', CheckUserLogin, CheckPremium, GroupTaskController.postGroupCreate)

module.exports = router