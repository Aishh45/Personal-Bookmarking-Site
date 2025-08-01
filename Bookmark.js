const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  title: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
