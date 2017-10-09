const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');

const app=express();
const port = process.env.PORT || 4000;

//DB config
const db = require('./config/database');

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//MAP GLOBAL PROMISE
mongoose.Promise=global.Promise;

//CONNECT TO mongoose
mongoose.connect(db.mongoURI,{
  useMongoClient: true
}).then(()=> console.log('MongoDB Connected...........'))
.catch(err => console.log(err));

//Static folder
app.use(express.static(path.join(__dirname,'public')));

//HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//BodyParser MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method-override MIDDLEWARE
app.use(methodOverride('_method'));

//INDEX ROUTE
app.get('/',(req,res)=>{
  const title='Welcome';
  res.render('index',{
    title: title
  });
});

//express-session MIDDLEWARE
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//Passport MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//connect-flash MIDDLEWARE
app.use(flash());

//Global
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//ABOUT ROUTE
app.get('/about',(req,res)=>{
  res.render('about');
});


//Use Routes
app.use('/ideas',ideas);
app.use('/users',users);

app.listen(port,()=>{
  console.log(`Server started on ${port}`);
});
