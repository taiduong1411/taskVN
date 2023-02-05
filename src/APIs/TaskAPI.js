const Task = require('../models/PersonTask')
const { options } = require('../routers/UserRouter')
const TaskAPI = {
    getOne: async(options) => {
        if (options._id) {
            return await Task.findOne({ _id: options._id }).lean()
                .then(task => {
                    return task
                })
        }
        if (options.taskID) {
            return await Task.findOne({ taskID: options.taskID }).lean()
                .then(task => {
                    return task
                })
        }
        if (options.personCreate) {
            return await Task.findOne({ personCreate: options.personCreate }).lean()
                .then(task => {
                    return task
                })
        }
        if (options.slug) {
            return await Task.findOne({ slug: options.slug }).lean()
                .then(task => {
                    return task
                })
        }
        if (options.title) {
            return await Task.findOne({ title: options.title }).lean()
                .then(task => {
                    return task
                })
        }
    },
    getAll: async(options) => {
        let sort = options.sort || 1
        let limit = options.limit || 0
        let skip = options.skip || 0

        return await Task.find({})
            .sort({ createdAt: sort })
            .limit(limit)
            .skip(skip)
            .lean()
            .then(tasks => {
                return tasks.map(tasks => {
                    return {
                        _id: tasks._id,
                        taskID: tasks.taskID,
                        title: tasks.title,
                        description: tasks.description,
                        personCreate: tasks.personCreate,
                        member: tasks.member,
                        isComplete: tasks.isComplete,
                        isHide: tasks.isHide,
                        slug: tasks.slug,
                        createdAt: (tasks.createdAt).toLocaleDateString('en-GB'),
                        updatedAt: (tasks.updatedAt).toLocaleDateString('en-GB')
                    }
                })
            })

    }
}
module.exports = TaskAPI