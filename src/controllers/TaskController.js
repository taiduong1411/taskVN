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
    },
    postTask: async(req, res, next) => {
        const { title, task } = req.body;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        function generateString(length) {
            var result = '';
            const charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
        }
        let code = generateString(10).toLocaleUpperCase()
        let tasks = await TaskAPI.getAll({ sort: 0 })
        let taskComplete = tasks.filter(tasks => tasks.isComplete === true)
        for (var i = 0; i < taskComplete.length; i++) {
            if (taskComplete[i].title.toLocaleLowerCase().trim() == title.toLocaleLowerCase().trim()) {
                return res.json({ "success": "task was created" })
            }
        }
        let data = {
            taskID: code,
            title: title,
            description: task,
            personCreate: req.session.email
        }
        await Task(data).save()
        return res.redirect('/user/list-task')
    },
    getListTask: async(req, res, next) => {
        let tasks = await TaskAPI.getAll({ sort: 0 })
        let user = await UserAPI.getOne({ email: req.session.email })
        let myTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == false)
        let myCompletedTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == true)
        return res.render('user/list-task', {
            email: req.session.email,
            avatar: user.avatar,
            isPremium: (user.isPremium == true) ? false : true,
            myTask: myTask,
            myCompletedTask: myCompletedTask
        })
    }
}
module.exports = TaskController