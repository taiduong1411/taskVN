const OTP = require('../models/OTP');



const OtpAPI = {
    getOne: async(options) => {
        if (options.email) {
            return await OTP.findOne({ email: options.email }).lean()
                .then(otp => {
                    return otp
                })
        }
        if (options.code) {
            return await OTP.findOne({ code: options.code }).lean()
                .then(otp => {
                    return otp
                })
        }
    }
}







module.exports = OtpAPI;