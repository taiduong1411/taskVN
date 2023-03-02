const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
const taskDetail = new Schema({
    taskName: String,
    isFinish: {
        type: Boolean,
        default: false
    }
});
const TaskModel = new Schema({
    taskID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: [taskDetail]
    },
    personCreate: {
        type: String,
        require: true
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    isHide: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: 'title'
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('PersonTask', TaskModel)