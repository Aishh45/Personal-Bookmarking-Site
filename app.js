const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

require('./database/connection');

const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmark');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', authRoutes);
app.use('/bookmarks', bookmarkRoutes);

app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

app.listen(3001, () => {
  console.log('Server started at http://localhost:3001');
});
module.exports = app;