var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var index = require('./routes/index');
var signup = require('./routes/signup');
var signin = require('./routes/signin');
var users = require('./routes/users');
var mongoose = require('mongoose');
require('dotenv').config()
const todoModel = require('./models/todo')
mongoose.connect('mongodb://localhost/todofancies');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connecting to database');
});
var app = express();

const mailConfig = {
  // host: 'smtp.gmail.com',
  // port: 465,
  service: 'gmail',
  auth: {
    user: 'ferdy26790@gmail.com',
    pass: process.env.PASSWORD
  }
}

const transporter = nodemailer.createTransport(smtpTransport(mailConfig));
let mailOptions = {
  from: 'ferdy26790@gmail.com',
  to: '',
  subject: 'REMINDER',
  html: ''
}
// transporter.sendMail(mailOptions, (err, status) => {
//   if (!err) {
//     console.log(status)
//   } else {
//     console.log(err)
//   }
// })
setInterval(function(){
   todoModel.find()
   .populate('userId')
   .then((todos) => {
     todos.map((todo) => {
       const current = new Date()
       if( todo.reminder > current && todo.status == 'uncomplete') {
         let remaining = todo.reminder - current
         remaining = Math.ceil(remaining / (1000 * 3600 * 24))
         if (remaining < 2 && remaining >= 0 ) {
           console.log('masuk');
           const toEmail = todo.userId.email
           mailOptions.to = toEmail
           mailOptions.html = `<h1 style="color: red;">your deadline is ${remaining} days again!!!</h1> <img src="https://media.giphy.com/media/RoYYLVonLScsE/giphy.gif" alt="hurry up"/>`
           transporter.sendMail(mailOptions, (err, status) => {
             if (!err) {
               console.log(status)
             } else {
               console.log(err)
             }
           })
         }
         console.log()
       }
     })
   }).catch((err) => {
     console.log(err)
   })
 }, 43200000);
app.use(cors())
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/todo', index);
app.use('/api/users', users);
app.use('/api/signup', signup)
app.use('/api/signin', signin)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
