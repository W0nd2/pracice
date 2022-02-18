"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_1 = __importDefault(require("passport"));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: '237820078797-cbtech7j76m7mrnb7pd87omtv0qj5aek.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
//# sourceMappingURL=pasportStrategy.js.map