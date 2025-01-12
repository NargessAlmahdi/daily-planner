require('dotenv').config();
require('./config/database');
const express = require('express');

const app = express();
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const addUserToViews = require('./middleware/addUserToViews');

// Controllers
const authController = require('./controllers/auth');
const isSignedIn = require('./middleware/isSignedIn');
const tasksController = require('./controllers/tasks.js')

// PORT
const port = process.env.PORT ? process.env.PORT : '3000';



// MIDDLEWARE

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(addUserToViews);

// Public Routes
app.get('/', async (req, res) => {
  if (req.session.user){
    res.redirect(`/users/${req.session.user._id}/tasks`)
  }else{
  res.render('index.ejs');
  }
});

app.use('/auth', authController);


// Protected Routes
app.use(isSignedIn);
app.use('/users/:userId/tasks', tasksController)

// app.put("/tasks/:taskId", async (req, res) => {
//   if (req.body.priority === "on") {
//     req.body.priority = true;
//   } else {
//     req.body.priority = false;
//   }
  
//   await Fruit.findByIdAndUpdate(req.params.taskId, req.body);
//   res.redirect(`/tasks/${req.params.taskId}`);
// });


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
