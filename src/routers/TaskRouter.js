const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/TaskController')
const CheckUserLogin = require('../middlewares/CheckUserLogin')
const CheckPremium = require('../middlewares/CheckPremium')

router.get('/create-task', CheckUserLogin, TaskController.getCreate)
router.get('/list-task', CheckUserLogin, TaskController.getListTask)
router.get('/list-task/:id', CheckUserLogin, TaskController.getDoneTask)
router.get('/list-task/delete/:id', CheckUserLogin, TaskController.getDeleteTask)
router.get('/list-task/hide/:id', CheckUserLogin, TaskController.getHideTask)
router.get('/hide-task', CheckUserLogin, TaskController.getShowHideTask)
router.get('/hide-task/:id', CheckUserLogin, TaskController.getShowTask)
router.get('/reactive/:id', CheckUserLogin, TaskController.getReActive)
router.get('/search', CheckUserLogin, TaskController.getSearch)
router.get('/update/:id', CheckUserLogin, TaskController.getUpdate)
router.get('/check-done/:id', CheckUserLogin, TaskController.getCheckDone)



router.post('/create-task', CheckUserLogin, TaskController.postTask)
module.exports = router