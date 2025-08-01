const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

router.get('/', isLoggedIn, async (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const query = {
    userId: req.session.userId,
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { url: { $regex: search, $options: 'i' } }
    ]
  };

  const total = await Bookmark.countDocuments(query);
  const bookmarks = await Bookmark.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.render('bookmarks', {
    bookmarks,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    search
  });
});

router.post('/add', isLoggedIn, async (req, res) => {
  const count = await Bookmark.countDocuments({ userId: req.session.userId });
  if (count >= 5) return res.send('Maximum 5 bookmarks allowed!');
  const { title, url } = req.body;
  await Bookmark.create({ title, url, userId: req.session.userId });
  res.redirect('/bookmarks');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.session.userId });
  res.render('edit', { bookmark });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { title, url } = req.body;
  await Bookmark.updateOne({ _id: req.params.id, userId: req.session.userId }, { title, url });
  res.redirect('/bookmarks');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  await Bookmark.deleteOne({ _id: req.params.id, userId: req.session.userId });
  res.redirect('/bookmarks');
});

module.exports = router;
