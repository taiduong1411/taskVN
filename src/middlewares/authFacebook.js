const FacebookStrategy = require('passport-facebook').Strategy
const passport = require('passport')
const User = require('../models/User')
const key = require('../services/FacebookAuthKey')
const { profile } = require('console')

passport.use(
    new FacebookStrategy({
        clientID: key.facebookClientID,
        clientSecret: key.facebookClientSecret,
        callbackURL: '/auth/facebook/callback',
        passReqToCallback: true,
        profileFields: ['id', 'emails', 'name', 'photos', 'displayName']
    }, async(req, accessToken, refreshToken, public_profile, done) => {
        await User.findOne({ email: public_profile.emails[0].value }).then(async user => {
                if (!user) {
                    let data = {
                        SocialID: public_profile.id,
                        fullName: public_profile.displayName,
                        email: public_profile.emails[0].value,
                        avatar: public_profile.photos[0].value,
                        provider: 'facebook'
                    }
                    await User(data).save()
                    return done(null, data)
                } else {
                    return done(null, user)
                }
            })
            // console.log(public_profile)
    })
)
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user)
})