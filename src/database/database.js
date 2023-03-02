const mongoose = require('mongoose')
const uri = "mongodb+srv://taiduong:taiduong1411@taiduong.28espap.mongodb.net/taskVN?retryWrites=true&w=majority";
async function connect() {
    try {
        await mongoose.set('strictQuery', true);
        await mongoose.connect('mongodb://localhost:27017/TASK', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        console.log('connect db success')
    } catch (error) {
        console.log('connect db error')
    }
    // try {
    //     await mongoose.set('strictQuery', true);
    //     await mongoose.connect(uri, {
    //         useNewUrlParser: true
    //     })
    //     console.log('connect db success')
    // } catch (error) {
    //     console.log('connect db error')
    // }
};
module.exports = { connect };