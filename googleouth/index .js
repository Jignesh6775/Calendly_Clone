// const express = require("express")
// // const passport = require("")
// const passport = require("passport");

// const app = express()






// var GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//     clientID: id,
//     clientSecret: secret,
//     callbackURL: "http://localhost:8080/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//     console.log(profile)
//   }
// ));



// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' ,session:false}),
//   function(req, res) {
//     console.log("thyankyou")
//     // Successful authentication, redirect home.
//     res.send('thankyou');
//   });





// app.get("/",(req,res)=>{
// //   res.sendFile(__dirname+"/index.html")
// console.log("hom")
//     res.send("Homepage")
//     // res.status(200).redirect('https://www.google.com/');
// })

// app.listen(8080,()=>{
//     console.log("server is running")
// })













const express = require("express");
const app = express();
const passport= require("passport")
// require("dotenv").config();

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: id,
  clientSecret: secret,
  callbackURL: "http://localhost:8080/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
  console.log(profile)
}
));

app.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.get("/",(req,res)=>{
  res.send("hello")
})

app.listen(8080,()=>{
    console.log("server is running ")
})