const Task = require('../models/PersonTask')
const User = require('../models/User')
const TaskAPI = require('../APIs/TaskAPI')
const express = require('express')
const UserAPI = require('../APIs/UserAPI')
const PersonTask = require('../models/PersonTask')




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
        let descriptions = [];
        task.forEach(item => {
            let taskDetail = {
                taskName: item
            }
            descriptions.push(taskDetail)
        });

        let data = {
            taskID: code,
            title: title,
            description: descriptions,
            personCreate: req.session.email
        }
        await Task(data).save()
        return res.redirect('/task/list-task')
    },
    getListTask: async(req, res, next) => {
        var tasks = await TaskAPI.getAll({ sort: 0 })
            // var myTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == false)
        for (var i = 0; i < tasks.length; i++) {
            var k = 0
            for (var j = 0; j < tasks[i].description.length; j++) {
                if (tasks[i].description[j].isFinish == true) {
                    k = k + 1
                } else {
                    k = k + 0
                }
            }
            if (k == tasks[i].description.length) {
                const _id = (tasks[i]._id).toString()
                await Task.findOne({ _id: _id }).then(task => {
                    if (!task) {
                        return res.redirect('/404')
                    } else {
                        task.isComplete = true
                        task.save()
                    }
                })
            }
        }
        var myTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == false)
        var myCompletedTask = tasks.filter(tasks => tasks.personCreate == req.session.email && tasks.isComplete == true && tasks.isHide == false)
        return res.render('task/list-task', {
            email: req.session.email,
            avatar: req.session.avatar,
            isPremium: (req.session.isPremium == true) ? false : true,
            myTask: myTask.slice(0, 3),
            myCompletedTask: myCompletedTask.slice(0, 3),
            fullName: req.session.fullName,
        })
    },
    getCheckDone: async(req, res, next) => {
        const idUrl = req.params.id
        let tasks = await TaskAPI.getAll({ sort: 0 })
        for (var i = 0; i < tasks.length; i++) {
            for (var j = 0; j < tasks[i].description.length; j++) {
                var _id = (tasks[i].description[j]._id).toString()
                if (_id == idUrl) {
                    let _idTask = (tasks[i]._id).toString()
                    let update = tasks[i].description[j].isFinish = true
                    let description_ = tasks[i].description[j].isFinish
                    let data = tasks[i].description
                        // console.log(data)
                    await PersonTask.findByIdAndUpdate(_idTask, { description: data })
                }
            }
        }
        return res.redirect('/task/list-task')
    },
    getDoneTask: async(req, res, next) => {
        const idUrl = req.params.id
        let task = await Task.findOne({ _id: idUrl }).then(async task => {
            if (!task) {
                return res.redirect('/404')
            } else {
                task.isComplete = true
                for (var i = 0; i < task.description.length; i++) {
                    let update = task.description[i].isFinish = true
                    let description_ = task.description[i].isFinish
                    let data = task.description
                    await PersonTask.findByIdAndUpdate(idUrl, { description: data })
                }
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
        await Task.findByIdAndUpdate({ _id: idUrl }, { isComplete: false }).then(async task => {
            for (var i = 0; i < task.description.length; i++) {
                let update = task.description[i].isFinish = false
                let description_ = task.description[i].isFinish
                let data = task.description
                await PersonTask.findByIdAndUpdate(idUrl, { description: data })
            }
            // console.log(task.description)
        })
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
    }

}
module.exports = TaskController