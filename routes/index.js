var express = require("express");
var router = express.Router();
var userModel = require("./users");
const passport = require("passport");
var localStrategy=require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
// Define a route for the root path
router.get("/", function (req, res, next) {
  // Render the index view with the title "Express"
  res.render("index");
});
router.post("/register", (req, res, next) => {
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
    picture: req.body.picture,
    // password:req.body.password,
  })
  
  // console.log(newUser)
  userModel.register(newUser, req.body.password)
  .then(function(newUser){
     passport.authenticate('local')
     (req,res,function(){
       console.log("user registered");
       res.redirect("/cardView")
     })
  }).catch(function(e){
    console.error(e);
 });
});

router.post('/login', 
  passport.authenticate('local', { 
    successRedirect : '/cardView',
    failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get("/login",  async function (req, res, next) {
  res.render("login",);
});

// router.post('/register', async function(req, res, next) {

//     // Create a new user
//     let user= await userModel.create({
//       // Get the username from the request body
//       username:req.body.username,
//       // Get the email from the request body
//       email:req.body.email,
//       // Get the password from the request body
//       password:req.body.password,
//       // Get the picture from the request body
//       picture:req.body.picture,

//       likes:0
//     });
//     // Send the user back to the client
//     res.redirect('/cardView')
// });

// Define async function

router.get("/profile", isLoggedIn, async function (req, res, next) {
 var mainUser = await userModel.findOne({username:req.session.passport.user});
 console.log(mainUser)
//  const findAllUser = await userModel.find();
//  console.log(findAllUser)

  res.render("profile",{mainUser});
});
router.get("/cardView" , isLoggedIn ,async function (req, res, next) {
  // Find all users in the database
  console.log(" Cardview")
  const findAllUser = await userModel.find();
  // Render cardView template with findAllUser data
  res.render("cardView", { findAllUser });
});
// Find all userLiked in the database
router.get("/like/:id", isLoggedIn, async function (req, res, next) {
  // async function for route
  const likedUser = await userModel.findOne({ username: req.session.passport.user });
  // find user in db
  // console.log(likedUser);
  // console.log(req.params.id);
  // if(likedUser===){}
  // increment likes count
  likedUser.likes.push(req.params.id)
  // save updated user to db
  await likedUser.save();
  console.log(likedUser);
  // redirect to cardView page
  res.redirect("/cardView");
});
router.get("/logout",  async function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
    console.log("logout success")
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("isLoggedIn faild")
    res.redirect("/login");
  }
}

module.exports = router;
