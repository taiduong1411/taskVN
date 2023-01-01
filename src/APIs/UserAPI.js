const User = require('../models/User');



const UserAPI = {
    getOne: async(options) => {
        if (options._id) {
            return await User.findOne({ _id: options._id }).lean()
                .then(user => {
                    return user
                })
        }
        if (options.email) {
            return await User.findOne({ email: options.email }).lean()
                .then(user => {
                    return user
                })
        }
    }
}







module.exports = UserAPI;