/* eslint-disable prefer-destructuring */
const express = require('express');
const User = require('../models/user');
const auth = require('../config/auth');

const router = express.Router();

// Sign up
router.get('/sign-up', async (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  // grab the values from the req body
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // Check if the user already exists
  const existingUser = await User.findOne({ username });

  // if the user exists,then dont bother doing anything, just send a message to the browser
  if (existingUser) {
    return res.send('Username is taken');
  }
  // verify that the password matches
  if (password !== confirmPassword) {
    return res.send("Passwords don't match!");
  }


  const hashPassword = auth.encryptPassword(password);
  const payload = { username, password: hashPassword };

  const newUser = await User.create(payload);
  req.session.user = {
    username: newUser.username,
    _id: newUser._id,
  };

  req.session.save(() => {
    res.redirect('/');
  });
});

// Sign in
router.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ username });
  if (!user) {
    return res.send('Login failed, please try again');
  }

  const validPassword = auth.comparePassword(password, user.password);
  if (!validPassword) {
    return res.send('Login failed, please try again');
  }
  req.session.user = {
    username: user.username,
    _id: user._id,
  };

  req.session.save(() => {
    res.redirect('/');
  });
});

// Sign out
router.get('/sign-out', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
