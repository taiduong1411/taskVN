const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const GroupModel = new Schema({
    taskGID: {
        type: String,
    },
    description: {
        type: [{
            email: String,
            detail: String,
        }],
    },
    file: {
        type: [{
            file_name: String,
            email_submit: String
        }],
    },
})
module.exports = mongoose.model('GroupChat', GroupModel)