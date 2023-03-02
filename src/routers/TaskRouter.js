const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/TaskController')
const CheckPremium = require('../middlewares/CheckPremium')
const User = require('../models/User')

function isLog(req, res, next) {
    if (req.user || req.session.email) {
        next()
    } else {
        return res.redirect('/user/login')
    }
}

router.get('/create-task', isLog, TaskController.getCreate)
router.get('/list-task', isLog, TaskController.getListTask)
router.get('/list-task/:id', isLog, TaskController.getDoneTask)
router.get('/list-task/delete/:id', isLog, TaskController.getDeleteTask)
router.get('/list-task/hide/:id', isLog, TaskController.getHideTask)
router.get('/hide-task', isLog, TaskController.getShowHideTask)
router.get('/hide-task/:id', isLog, TaskController.getShowTask)
router.get('/reactive/:id', isLog, TaskController.getReActive)
router.get('/search', isLog, TaskController.getSearch)
router.get('/update/:id', isLog, TaskController.getUpdate)
router.get('/check-done/:id', isLog, TaskController.getCheckDone)
router.get('/chat/:id', isLog, CheckPremium, TaskController.getChat_Friend)



router.post('/create-task', isLog, TaskController.postTask)
module.exports = router