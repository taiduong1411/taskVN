const express = require('express')
const TaskController = require('../controllers/TaskController')
const CheckUserLogin = require('../middlewares/CheckUserLogin')
const router = express.Router()

router.get('/create-task', CheckUserLogin, TaskController.getCreate)






module.exports = router