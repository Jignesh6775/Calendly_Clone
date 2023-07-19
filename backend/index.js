const express=require("express");
const { connection } = require("./config/db");
const {userRouter}=require("./routes/user");

 const {authenticator}=require("./middleware/authentication")
 const cors = require('cors')



require("dotenv").config();

const port=process.env.PORT||8090;

const app=express();
app.use(express.json());
app.use(cors())

app.use("/user",userRouter)



const id = "802698597926-utcnbupvlou3uifkv2pguns0ne8vgbtm.apps.googleusercontent.com";
const secret = "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"
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.use(new GoogleStrategy({
  clientID: id,
  clientSecret: secret,
  callbackURL: "https://setcal-front-end-deploy.vercel.app/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  console.log(request)

  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// const express = require('express');
const session = require('express-session');

// require('./auth');

// const app = express()

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected',  (req, res) => {
  res.redirect("../frontend/meetform");
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});
app.use(authenticator);
app.get("/get",(req,res)=>{
    res.send("done")
})





app.listen(port,async()=>{
    try {
        await connection
        console.log("Connection to db and listening on port "+port)
    } catch (error) {
        console.log(error.message)
        console.log("Unable to connect to db")
    }
})