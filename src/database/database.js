const mongoose = require('mongoose')
async function connect() {
    try {
        await mongoose.set('strictQuery', true);
        await mongoose.connect('mongodb://localhost:27017/TASK', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('connect db success')
    } catch (error) {
        console.log('connect db error')
    }
};
module.exports = { connect };