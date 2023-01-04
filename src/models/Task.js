const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
const TaskModel = new Schema({
    taskID: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    personCreate: {
        type: String,
        require: true
    },
    member: {
        type: [String]
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: 'taskID'
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Task', TaskModel)