const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const route = require('./routes/index');
const user = require('./routes/users');

const app = express();

require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db,{useNewUrlParser:true})
   .then(() => console.log('Mongodb Connected...'))
   .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.static(__dirname + '/views'));

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Express session
app.use(
    session({
        secret:'secret',
        resave:true,
        saveUninitialized:true
    })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
//Routes
app.use('/',route);
app.use('/users',user);

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server Started on port ${PORT}`));