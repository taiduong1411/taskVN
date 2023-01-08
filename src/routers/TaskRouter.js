const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/TaskController')
const CheckUserLogin = require('../middlewares/CheckUserLogin')

router.get('/create-task', CheckUserLogin, TaskController.getCreate)
router.get('/list-task', CheckUserLogin, TaskController.getListTask)


router.post('/create-task', CheckUserLogin, TaskController.postTask)
module.exports = router