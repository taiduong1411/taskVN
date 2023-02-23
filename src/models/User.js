const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserModel = new Schema({
    googleID: {
        type: String
    },
    fullName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    level: {
        type: String
    },
    password: {
        type: String,
    },
    myFriend: {
        type: [String]
    },
    myGroupTask: {
        type: [{
            gid: String,
            groupName: String,
            member: {
                email: [String]
            }
        }]
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('User', UserModel);