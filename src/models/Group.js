const mongoose = require('mongoose')
const Schema = mongoose.Schema()
const GroupModel = new Schema({
    task_name: {
        type: String,
        required: true
    },
    description: {
        type: [String],
        required: true
    },
    member: {
        type: [String],
        required: true
    },
    file: {
        type: [String],
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('Group', GroupModel)