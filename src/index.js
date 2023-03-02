const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const database = require('./database/database')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cookieSession = require('cookie-session')
    // const { google } = require('googleapis')
const port = process.env.PORT || 3000
database.connect();
// CONTROLLERS
const UserController = require('./controllers/UserController')
const PaymentController = require('./controllers/PaymentController')
const TaskController = require('./controllers/TaskController')
const GroupTaskController = require('./controllers/GroupTaskController')




// ROUTER
const UserRouter = require('./routers/UserRouter')
const PaymentRouter = require('./routers/PaymentRouter')
const TaskRouter = require('./routers/TaskRouter')
const GroupTaskRouter = require('./routers/GroupTaskRouter')


// MODELS
const User = require('./models/User');
const OTP = require('./models/OTP')
const Task = require('./models/PersonTask')
const GroupChat = require('./models/Chat_Group')

// API
const UserAPI = require('./APIs/UserAPI');
const OtpAPI = require('./APIs/OTPAPI');
const TaskAPI = require('./APIs/TaskAPI');
// HELPER



//SERVICE
const key = require('./services/GoogleAuthKey')

// MIDDLEWARE

const authGoogle = require('./middlewares/authGoogle')
const authFacebook = require('./middlewares/authFacebook')
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
// app.use(session({ cookie: { maxAge: 100000 } }));
app.use(session({
    cookie: { maxAge: (1000 * 60 * 40) },
    secret: 'foo',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://taiduong:taiduong1411@taiduong.28espap.mongodb.net/taskVN?retryWrites=true&w=majority'
    })
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use(passport.initialize());
app.use(passport.session());


// index

app.use('/user', UserRouter, TaskRouter)
app.use('/task', TaskRouter, GroupTaskRouter)
app.use('/payment', PaymentRouter)

function isLog(req, res, next) {
    if (req.user || req.session.email) {
        next()
    } else {
        return res.redirect('/user/login')
    }
}
//GOOGLE
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: "/404",
        successRedirect: "/home"
    })
);
// FACEBOOK
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}))
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: "/404",
        successRedirect: "/home"
    })
)


app.get('/get-started', async(req, res, next) => {
    return res.render('get-started')
})
app.get('/home', isLog, async(req, res, next) => {
    let error = req.flash('error' || '')
    let success = req.flash('success' || '')
    let user = await UserAPI.getOne({ email: req.session.email || req.user.email })
        // console.log(user)
    if (!user) {
        return res.redirect('/user/register')
    }
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
    return res.redirect('/get-started')
})

// SOCKET.IO
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })
server.listen(port, () => {
    console.log(`Sever running on ${port}`)
})
io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);
    // socket.emit('message', 'Hello world');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('message', (data) => {
        socket.broadcast.emit('message', data)
    })
});