const Task = require('../models/Task')
const TaskAPI = require('../APIs/TaskAPI')
const express = require('express')
const UserAPI = require('../APIs/UserAPI')




const TaskController = {
    getCreate: async(req, res, next) => {
        let user = await UserAPI.getOne({ email: req.session.email })
        return res.render('user/create-task', {
            email: user.email,
            avatar: user.avatar,
            isPremium: (user.isPremium == true) ? false : true,
            fullName: user.fullName
        })
    }
}
module.exports = TaskController