const Task = require('../models/PersonTask')
const TaskAPI = require('../APIs/TaskAPI')
const User = require('../models/User')
const UserAPI = require('../APIs/UserAPI')
const express = require('express')

const GroupTaskController = {
    getGroupTask: async(req, res, next) => {
        let user = await UserAPI.getOne({ email: req.session.email })
        if (user.myGroupTask == '') {
            return res.render('task/group/group-task', {
                avatar: req.session.avatar,
                toast: true
            })
        } else {
            return res.render('task/group/group-task', {
                avatar: req.session.avatar,
                data: user.myGroupTask
            })

        }
    },
    getGroupCreate: async(req, res, next) => {
        return res.render('task/group/create')
    },
    postGroupCreate: async(req, res, next) => {
        const { groupName } = req.body
        let user = await User.findOne({ email: req.session.email }).then(user => {
            if (!user) {
                return res.redirect('/task/group/group-task')
            } else {
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

                const data = {
                    gid: code,
                    groupName: groupName,
                    member: {
                        email: user.email
                    }
                }
                user.myGroupTask.push(data)
                console.log(user)
                    // return res.redirect('/task/group/group-task')
            }

        })

    }
}
module.exports = GroupTaskController