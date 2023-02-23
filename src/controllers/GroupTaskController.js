const Task = require('../models/PersonTask')
const TaskAPI = require('../APIs/TaskAPI')
const User = require('../models/User')
const GroupChat = require('../models/Chat_Group')
const UserAPI = require('../APIs/UserAPI')
const express = require('express')


const GroupTaskController = {
    getGroupTask: async(req, res, next) => {
        await User.findOne({ email: req.session.email }).lean().then(async user => {
            if (user.myGroupTask == '') {
                return res.render('task/group/group-task', {
                    avatar: req.session.avatar,
                    toast: true
                })
            } else {
                var friend_data = []
                var group_data = []
                for (var i = 0; i < user.myFriend.length; i++) {
                    await User.findOne({ email: user.myFriend[i] }).then(friend => {
                        if (!friend) {
                            return res.redirect('/404')
                        } else {
                            var data = {
                                _id: (friend._id).toString(),
                                fullName: friend.fullName,
                                avatar: friend.avatar
                            }
                            friend_data.push(data)
                        }
                    })
                }
                return res.render('task/group/group-task', {
                    avatar: req.session.avatar,
                    data: user.myGroupTask,
                    list_friends: friend_data
                })
            }
        })
    },
    getGroupCreate: async(req, res, next) => {
        return res.render('task/group/create')
    },
    postGroupCreate: async(req, res, next) => {
        const { groupName, myFriend } = req.body
        let user = await User.findOne({ email: req.session.email }).then(async user => {
            if (!user) {
                return res.redirect('/404')
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
                var code = generateString(10).toLocaleUpperCase()
                let data = {
                    gid: code,
                    groupName: groupName,
                    member: {
                        email: user.email
                    }
                }
                User.findOne({ email: myFriend }).then(async friend => {
                    if (!friend) {
                        return res.redirect('/404')
                    } else {
                        user.myFriend = myFriend
                        friend.myFriend = user.email
                        user.myGroupTask.push(data)
                        await user.save()
                        await friend.save()
                        return res.redirect('/task/group/group-task')
                    }
                })
            }
        })
    }
}
module.exports = GroupTaskController