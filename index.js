//////////////////////////REQUIRE/////////////////////////

const fs = require("fs");

//////////////////////////JQUERY/////////////////////////
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//////////////////////EXPRESS JS////////////////////////
// get express and bring into project
const express = require("express");
// create an alias 
const app = express();
// create a port
const port = 3000;
// start listening
app.listen(port,
    function(){
        console.log("server is running on port " + port);
    });
const bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// setting ejs
app.set("view engine","ejs");

//////////////////////MONGOOSE////////////////////////
const mongoose = require("mongoose")
// new requires for passport
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");
const { timeStamp } = require("console");
require("dotenv").config();
// set up session
app.use(session({
    secret: process.env.SECRET, // stores our secret in our .env file
    resave: false,              // other config settings explained in the docs
    saveUninitialized: false
}));
// set up passport
app.use(passport.initialize());
app.use(passport.session());
// passport needs to use MongoDB to store users and tasks
mongoose.connect("mongodb://localhost:27017/lab4DB", 
                {useNewUrlParser: true, // these avoid MongoDB deprecation warnings
                 useUnifiedTopology: true});

//////////////////////USER SCHEMA////////////////////////
const userSchema = new mongoose.Schema ({
    username: String,
    password: String
})

//////////////////////MONGOOSE CONFIG////////////////////////
// configure passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

// Collection of users
const User = module.exports = new mongoose.model("User", userSchema)
User.getAllUsers = function(callback){ // we will pass a function :)
    User.find().lean().exec(function (err, docs) {
    //console.log(docs); // returns json
    callback(docs); // <-- call the function passed as parameter
});
}
// CREATE UNDEFINED USER
//User.register({username: "undefined"}, "undefined", function(err, user){});

// more passport-local-mongoose config
// create a strategy for storing users with Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////////////TASK SCHEMA////////////////////////
const taskSchema = new mongoose.Schema ({
    name: String,
    owner: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
    creator: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
    done: Boolean,
    cleared: Boolean
})

// Collection of tasks
const Task = new mongoose.model("Task", taskSchema);
Task.getAllTasks = function(callback){ // we will pass a function :)
    Task.find().lean().exec(function (err, docs) {
    //console.log(docs); // returns json
    callback(docs); // <-- call the function passed as parameter
});
}



//////////////////////ROUTING////////////////////////

// HOME PAGE ** DONE
app.get("/",
function(req,res){
    res.render("index");
});

// LOGIN ** DONE
app.post('/login', function(req, res, next) {
    console.log("A user is logging in")
    // create a user
const user = new User ({
    username: req.body.username,
    password: req.body.password
});

    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        ssn = req.session;
        ssn.email=req.body.username;
        return res.redirect(307, "/todo");
      });
    })(req, res, next);
  });

// REGISTER ** DONE
app.post("/register", function(req, res) {
    console.log("Registering a new user");
    var authentication = req.body.authentication;
    if(authentication == 1234){ 
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/")
        } else {
            passport.authenticate("local")(req, res, function(){
                ssn = req.session;
                ssn.email=req.body.username;
                res.redirect(307, "/todo")
            });
        }
    });
 }else{res.redirect("/")}
});

// TO DO ** DONE
app.post("/todo",
async function(req,res){
    if(ssn.email != ""){//CHECK SESSION VARIABLE
    console.log("Rendering to do list")
    var email = ssn.email;
    var userId = req.user._id;
    function retrieveTask(callback) {
        Task.find().lean().exec(function (err, docs) {
            if(err){
                //console.log(err);
            }
            //console.log(docs); // returns json
            callback(docs);
            var title = "To Do List Title";
            res.render("todo", {userId: userId, title: title, email:email, taskList: docs});
            
        });
      };

    await retrieveTask(function(err, taskDoc){
          if(err){
              //console.log(err);
          }
      })
    } else{res.redirect("/")}
});

// CLAIM ** DONE
app.post("/claim",
async function(req,res){
    var email = ssn.email;
    var taskId = req.body.taskId;
    function claim(email, taskId){
        Task.findByIdAndUpdate(taskId,  
         {owner:email}, function (err, docs) { 
         if (err){ 
             console.log(err) 
         } 
         else{ 
             //console.log("Updated Docs : ", docs); 
             res.redirect(307, "/todo")
         } 
     }); 
   }
   await claim(email, taskId);

});
// ABANDON OR COMPLETE ** DONE
app.post("/abandonorcomplete",
async function(req,res){
    var taskId = req.body.taskId;
    var checkBox = req.body['checkboxId'+taskId];
    var email = ssn.email;
    
    // ABANDON
    function abandon(taskId){
        Task.findByIdAndUpdate(taskId,  
         {owner: "undefined"}, function (err, docs) { 
         if (err){ 
             console.log(err) 
         } 
         else{ 
             //console.log("Updated Docs : ", docs); 
             res.redirect(307, "/todo")
         } 
     }); 
   }
       // COMPLETE
       function complete(taskId){
        Task.findByIdAndUpdate(taskId,  
         {done: true}, function (err, docs) { 
         if (err){ 
             console.log(err) 
         } 
         else{ 
             //console.log("Updated Docs : ", docs); 
             res.redirect(307, "/todo")
         } 
     }); 
   }
   if(checkBox == 'on'){
    await complete(taskId);
   } else{await abandon(taskId);}

});
// ADD TASK ** DONE
app.post("/addtask",
function(req,res){
var title = "To Do List Title";
   var email = ssn.email;
   var addText = req.body.addText;

   function createTask(name, creator){
    const task = new Task ({
        name: name,
        owner: "undefined",
        creator: creator,
        done: false,
        cleared: false
    });
    task.save();
}
    createTask(addText, email);
   res.redirect(307, "/todo")
});
// UNFINISH ** DONE
app.post("/unfinish",
async function(req,res){
    var email = ssn.email;
    var taskId = req.body.taskId;
    function unfinish(taskId){
        Task.findByIdAndUpdate(taskId,  
         {done: "false"}, function (err, docs) { 
         if (err){ 
             console.log(err) 
         } 
         else{ 
             //console.log("Updated Docs : ", docs); 
             res.redirect(307, "/todo")
         } 
     }); 
   }
   await unfinish(taskId);
});
// PURGE ** DONE
app.post("/purge",
function(req,res){
    Task.updateMany({done: true},  
        {cleared: true}, function (err, docs) { 
        if (err){ 
            console.log(err) 
        } 
        else{ 
            //console.log("Updated Docs : ", docs); 
            res.redirect(307, "/todo")
        } 
     });
});
// LOGOUT ** DONE
app.get("/logout",
function(req,res){
    req.logout();
    res.redirect("/");
});

