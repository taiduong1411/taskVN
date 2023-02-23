const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatModel = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    messages: {
        type: [{
            email: String,
            message: String,
            createdAt: Date
        }],
    },
})