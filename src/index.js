const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const database = require('./database/database.js')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const port = process.env.PORT || 3000
database.connect();
// CONTROLLERS
const UserController = require('./controllers/UserController')
const PaymentController = require('./controllers/PaymentController')
const TaskController = require('./controllers/TaskController')




// ROUTER
const UserRouter = require('./routers/UserRouter');
const PaymentRouter = require('./routers/PaymentRouter');
const TaskRouter = require('./routers/TaskRouter')


// MODELS
const User = require('./models/User');
const OTP = require('./models/OTP')
const Task = require('./models/Task')

// API
const UserAPI = require('./APIs/UserAPI');
const OtpAPI = require('./APIs/OTPAPI');
const TaskAPI = require('./APIs/TaskAPI');
// HELPER



// config
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser('ddn'));
app.use(session({ cookie: { maxAge: 100000 } }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// index

app.use('/user', UserRouter, TaskRouter)
app.use('/payment', PaymentRouter)

app.get('/get-started', async(req, res, next) => {
    return res.render('get-started')
})
app.get('/home', async(req, res, next) => {
    if (!req.session.email) {
        return res.redirect('/user/login')
    }
    let error = req.flash('error' || '')
    let success = req.flash('success' || '')
    let user = await UserAPI.getOne({ email: req.session.email })
    let today = new Date().toLocaleDateString()
    let time = new Date().toLocaleTimeString()
    return res.render('home', {
        fullName: user.fullName,
        today: today,
        time: time,
        avatar: user.avatar,
        isPremium: (user.isPremium == true) ? false : true,
        error: error,
        success: success
    })
})
app.get('/404', (req, res, next) => {
    return res.render('404')
})
app.get('/', (req, res, next) => {
    return res.redirect('/home')
})



// connect database
app.listen(port, () => {
    console.log(`Sever running on ${port}`)
})