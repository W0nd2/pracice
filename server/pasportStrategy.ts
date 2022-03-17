import {Strategy} from "passport-google-oauth2";
import passport from 'passport';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

passport.use(new Strategy(
    {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL,
        passReqToCallback: true
    },
    (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
        return done(null, profile);
    }
));