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
        clientID: '237820078797-cbtech7j76m7mrnb7pd87omtv0qj5aek.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:5000/api/auth/google/callback",
        passReqToCallback: true
    },
    (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
        return done(null, profile);
    }
));