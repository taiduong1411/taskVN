const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserModel = new Schema({
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
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    level: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    myFriend: {
        type: [String]
    },
    myGroupTask: {
        type: [String]
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('User', UserModel);