const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// # Connect to the MongoDB server
mongoose.connect("mongodb://127.0.0.1:27017/Social_media").then(()=>{
  // # Print a message to the console
  console.log("Connected to MongoDB...");
}).catch(error => {
  // Handle the error, or provide a message to the user
  console.error(`Error picking color: ${error.message}`);
});

const userSchema= mongoose.Schema({
  username:String,
  email:String,
  password:String,
  picture:String,
  likes:{type:Array,default:[]},
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("user",userSchema)
