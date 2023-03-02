const express = require('express');
const UserAPI = require('../APIs/UserAPI')
const OtpAPI = require('../APIs/OTPAPI')
const User = require('../models/User')
const OTP = require('../models/OTP')
const Task = require('../models/PersonTask')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const UserControllers = {
    getRegister: async(req, res, next) => {
        let error = req.flash('error' || '')
        let success = req.flash('success' || '')
        return res.render('user/register', {
            error: error,
            success: success
        })
    },
    postRegister: async(req, res, next) => {
        const { fullName, email, address, phoneNumber, password } = req.body;
        // const hashPassword = await bcrypt.hash(password, 10)
        if (!fullName || !email || !address || !phoneNumber || !password) {
            req.flash('error', 'Please fill all your information !')
            return res.redirect('/user/register')
        }
        let user = await UserAPI.getOne({ email: email })
        if (user) {
            req.flash('error', 'Email was used !')
            return res.redirect('/user/register')
        }
        const data = {
            SocialID: '',
            provider: 'local',
            fullName: fullName,
            avatar: 'https://cdna.artstation.com/p/assets/images/images/046/036/590/large/whitecap-220206-lotso-face-final-jpg.jpg?1644162312',
            email: email,
            address: address,
            phoneNumber: phoneNumber,
            level: "Customer",
            password: password
        }
        await User(data).save()
        req.flash('success', 'Register Successfully !')
        return res.redirect('/user/login')
    },
    getLogin: async(req, res, next) => {
        let error = req.flash('error' || '')
        let success = req.flash('success' || '')
        if (error) {
            return res.render('user/login', {
                error: error,
                success: success
            })
        }
    },
    postLogin: async(req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            req.flash('error', 'Please fill your email or password')
            return res.redirect('/user/login')
        }
        await User.findOne({ email: email }).then(async user => {
            if (!user) {
                req.flash('error', 'Email or Password was wrong !')
                return res.redirect('/user/login')
            } else {
                // const isValid = bcrypt.compare(password, user.password)
                if (user.password == password) {
                    req.session.email = email
                    req.session.level = user.level
                    req.session.fullName = user.fullName
                    req.session.isPremium = user.isPremium
                    req.session.avatar = user.avatar
                    user.isLogin = true
                    await user.save()
                    return res.redirect('/home')
                } else {
                    req.flash('error', 'Email or Password was wrong !')
                    return res.redirect('/user/login')
                }
            }
        })
    },
    getLogout: async(req, res, next) => {
        await User.findOne({ email: req.session.email || req.user.email }).then(async user => {
            // console.log(user)
            if (!user) {
                return res.redirect('/user/login')
            } else {
                user.isLogin = false
                await user.save()
                req.session.destroy(function() {
                    res.clearCookie('connect.sid', { path: '/' }).status(200)
                    return res.redirect("/user/login");
                });
                // return res.redirect('/user/login')
            }
        })
    },
    getForgotPassword: async(req, res, next) => {
        let error = req.flash('error' || '')
        return res.render('user/forgot-password', {
            error: error
        })
    },
    postForgotPassword: async(req, res, next) => {
        const { email } = req.body;
        let user = await UserAPI.getOne({ email })
        if (!user) {
            req.flash('error', 'Email does not exist !')
            return res.redirect('/user/forgot-password')
        } else {
            req.session.email = email
            return res.redirect('/user/send-code')
        }
    },
    getSendCode: async(req, res, next) => {
        return res.render('user/send-code')
    },
    postSendCode: async(req, res, next) => {
        let otp = await OtpAPI.getOne({ email: req.session.email })
        if (!otp) {
            var codeRandom = Math.floor(Math.random() * 10000).toString()
            const data = {
                email: req.session.email,
                code: codeRandom
            }
            await OTP(data).save();
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'djtimz1411@gmail.com',
                    pass: 'esfryvpkyuykxyzy'
                }
            })
            var mailOptions = {
                from: 'djtimz1411@gmail.com',
                to: req.session.email,
                subject: 'Verify Code to reset your password',
                text: codeRandom
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            req.flash('success', 'Code was send !')
            return res.redirect('/user/verify-code')
        } else {
            next();
        }
    },
    getVerifyCode: async(req, res, next) => {
        let success = req.flash('success' || '')
        let error = req.flash('error' || '')
        return res.render('user/verify-code', {
            error: error,
            success: success
        })
    },
    postVerifyCode: async(req, res, next) => {
        const { code } = req.body
        let otp = await OtpAPI.getOne({ code: code })
        if (!code) {
            req.flash('error', 'Please check and enter code in your email !')
            return res.redirect('/user/verify-code')
        }
        if (!otp) {
            req.flash('error', 'Code does not exist !')
            return res.redirect('/user/verify-code')
        }
        return res.redirect('/user/forgot-password-reset')
    },
    getForgotPasswordReset: async(req, res, next) => {
        let success = req.flash('success' || '')
        let error = req.flash('error' || '')
        return res.render('user/forgot-password-reset', {
            error: error,
            success: success
        })
    },
    postForgotPasswordReset: async(req, res, next) => {
        const { password } = req.body;
        if (!password) {
            req.flash('error', 'Please enter your new password !')
            return res.redirect('/user/forgot-password-reset')
        }
        let user = await User.findOne({ email: req.session.email }).then(user => {
            if (!user) {
                return res.redirect('/user/forgot-password')
            } else {
                user.password = password
                user.save()
                req.flash('success', 'Change Password Successfully !')
                return res.redirect('/user/login')
            }
        })
    },
    getProfile: async(req, res, next) => {
        let user = await UserAPI.getOne({ email: req.session.email || req.user.email })
        let tasks = await Task.find({ sort: 0 }).lean()
        let TaskActiveCount = tasks.filter(tasks => tasks.personCreate == user.email && tasks.isComplete == false)
        let TaskCompletedCount = tasks.filter(tasks => tasks.personCreate == user.email && tasks.isComplete == true)
        return res.render('user/my-profile', {
            fullName: user.fullName,
            avatar: user.avatar,
            email: user.email,
            isPremium: (user.isPremium == true) ? false : true,
            TaskActiveCount: TaskActiveCount.length,
            TaskCompletedCount: TaskCompletedCount.length,
            activeTask: TaskActiveCount,
            completedTask: TaskCompletedCount
        })
    }

}
module.exports = UserControllers