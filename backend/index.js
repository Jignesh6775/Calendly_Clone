const express=require("express");
const { connection } = require("./config/db");
const {userRouter}=require("./routes/user");
const passport=require("passport")
 const {authenticator}=require("./middleware/authentication")
 const cors = require('cors')
require("./config/google");
 require("dotenv").config();

const port=process.env.PORT||8090;

const app=express();
app.use(express.json());
app.use(cors())

app.use("/user",userRouter)


// "802698597926-utcnbupvlou3uifkv2pguns0ne8vgbtm.apps.googleusercontent.com";
// "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"
// const id = "977727599511-3n2ds31luj8sjnn6plb3iaiobtsde0k8.apps.googleusercontent.com"
// const secret = "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"
// const passport = require('passport');

// const GoogleStrategy = require('passport-google-oauth2').Strategy;

// passport.use(new GoogleStrategy({
//   clientID: id,
//   clientSecret: secret,
//   callbackURL: "localhost:8090/auth/google/callback",
//   passReqToCallback: true,
// },
// https://setcal-front-end-deploy.vercel.app
// function(request, accessToken, refreshToken, profile, done) {
//   console.log(profile)

//   return done(null, profile);
// }));

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// const express = require('express');
// const session = require('express-session');

// require('./auth');

// const app = express()

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    // successRedirect: '/protected',
    failureRedirect: '/auth/google/failure',
    session: false
  }),(req,res)=>{
    // console.log(req.user._json);
    // req.body=req.user._json;
    res.redirect(`https://thriving-raindrop-11b45e.netlify.app/meetform.html?email=${req.user._json.email}`);
    // res.redirect("http://127.0.0.1:5501/frontend/meetform.html");
  }
);

app.get('/protected',  (req, res) => {
  console.log(req.user);
  res.redirect("http://127.0.0.1:5501/frontend/meetform.html");
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

/*const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://vartalap-mpz9.onrender.com/admin/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser((user, done)=>{
    done(null, user);
})

passport.deserializeUser((user, done)=>{
    done(null, user);
}) */



app.listen(port,async()=>{
    try {
        await connection
        console.log("Connection to db and listening on port "+port)
    } catch (error) {
        console.log(error.message)
        console.log("Unable to connect to db")
    }
})