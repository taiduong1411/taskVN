const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const User = require('../models/User')
const key = require('../services/GoogleAuthKey')
const { profile } = require('console')

passport.use(
    new GoogleStrategy({
        clientID: key.googleClientID,
        clientSecret: key.googleClientSecret,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true
    }, async(req, accessToken, refreshToken, profile, done) => {
        await User.findOne({ email: profile.emails[0].value }).then(async user => {
            if (!user) {
                let data = {
                    googleID: profile.id,
                    fullName: profile._json.name,
                    email: profile._json.email,
                    avatar: profile._json.picture
                }
                await User(data).save()
                return done(null, data)
            } else {
                return done(null, user)
            }
        })
    })
)
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user)
})