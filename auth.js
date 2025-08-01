const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { username, password, confirm } = req.body;
  if (password !== confirm) return res.send('Passwords do not match');
  try {
    await User.create({ username, password });
    res.redirect('/login');
  } catch (err) {
    res.send('User already exists');
  }
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.userId = user._id;
    res.redirect('/bookmarks');
  } else {
    res.send('Invalid credentials');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;