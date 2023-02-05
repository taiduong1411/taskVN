const Task = require('../models/PersonTask')
const User = require('../models/User')
const TaskAPI = require('../APIs/TaskAPI')
const express = require('express')
const UserAPI = require('../APIs/UserAPI')




const TaskController = {
    getCreate: async(req, res, next) => {
        let user = await UserAPI.getOne({ email: req.session.email })
        return res.render('task/create-task', {
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
        return res.redirect('/task/list-task')
    },
    getListTask: async(req, res, next) => {
        let tasks = await TaskAPI.getAll({ sort: 0 })
            // let user = await UserAPI.getOne({ email: req.session.email })
        let myTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == false)
            // console.log(myTask.slice(0, 3))
        let myCompletedTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == true && tasks.isHide == false)
        return res.render('task/list-task', {
            email: req.session.email,
            avatar: req.session.avatar,
            isPremium: (req.session.isPremium == true) ? false : true,
            myTask: myTask.slice(0, 3),
            myCompletedTask: myCompletedTask.slice(0, 3),
            fullName: req.session.fullName
        })
    },
    getDoneTask: async(req, res, next) => {
        const idUrl = req.params.id
        let task = await Task.findOne({ _id: idUrl }).then(task => {
            if (!task) {
                return res.redirect('/task/list-task')
            } else {
                task.isComplete = true
                task.save()
            }
            return res.redirect('/task/list-task')
        })
    },
    getDeleteTask: async(req, res, next) => {
        const idUrl = req.params.id
        await Task.findByIdAndDelete({ _id: idUrl })
        return res.redirect('/task/list-task')
    },
    getHideTask: async(req, res, next) => {
        const idUrl = req.params.id
        await Task.findOneAndUpdate({ _id: idUrl }, { isHide: true })
        return res.redirect('/task/list-task')
    },
    getShowHideTask: async(req, res, next) => {
        let tasks = await TaskAPI.getAll({ sort: 0 })
        let user = await UserAPI.getOne({ email: req.session.email })
        let hideTasks = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == true && tasks.isHide == true)
        let myTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == false)
        return res.render('task/hide-task', {
            email: req.session.email,
            avatar: user.avatar,
            isPremium: (user.isPremium == true) ? false : true,
            myCompletedTask: hideTasks,
            myTask: myTask,
            fullName: req.session.fullName
        })
    },
    getShowTask: async(req, res, next) => {
        const idUrl = req.params.id
        await Task.findByIdAndUpdate({ _id: idUrl }, { isHide: false })
        return res.redirect('/task/list-task')
    },
    getReActive: async(req, res, next) => {
        const idUrl = req.params.id
        await Task.findByIdAndUpdate({ _id: idUrl }, { isComplete: false })
        return res.redirect('/task/list-task')
    },
    getSearch: async(req, res, next) => {
        let tasks_all = await TaskAPI.getAll({})
        var title = req.query.title
        if (!title) {
            return res.redirect('/user/list-task')
        }
        var data = tasks_all.filter(function(tasks) {
            return (tasks.title)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                .toLowerCase().trim()
                .indexOf(title.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/đ/g, 'd').replace(/Đ/g, 'D')) !== -1
        })
        if (data == '') {
            return res.render('task/search', {
                fullName: req.session.fullName,
                avatar: req.session.avatar,
                isPremium: (req.session.isPremium == true) ? false : true,
                null_data: true
            })
        } else {
            let myTask = data.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == false)
            let myCompletedTask = data.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == true && tasks.isHide == false)
            return res.render('task/search', {
                fullName: req.session.fullName,
                avatar: req.session.avatar,
                isPremium: (req.session.isPremium == true) ? false : true,
                myTask: myTask.slice(0, 3),
                myCompletedTask: myCompletedTask.slice(0, 3),
            })
        }


    },
    getUpdate: async(req, res, next) => {
        const idUrl = req.params.id
        let task = await TaskAPI.getOne({ _id: idUrl })
        return res.redirect()
    },
    getCompanyTask: async(req, res, next) => {
        return res.render('task/company/company')
    },
    getGroupTask: async(req, res, next) => {
        let user = await UserAPI.getOne({ email: req.session.email })
        if (user.myGroupTask == '') {
            return res.render('task/group/group-task', {
                avatar: req.session.avatar,
                toast: true
            })
        }
        return res.render('task/group/group-task', {
            avatar: req.session.avatar
        })
    },
    getGroupCreate: async(req, res, next) => {
        return res.render('task/group/create')
    },
    postGroupCreate: async(req, res, next) => {
        const { groupName } = req.body
        let user = await UserAPI.getOne({ email: req.session.email }).then(user => {
            if (!user) {
                return res.redirect('/task/group/group-task')
            }
            user.myGroupTask
        })

        return res.redirect('/task/group/group-task')
    }
}
module.exports = TaskController