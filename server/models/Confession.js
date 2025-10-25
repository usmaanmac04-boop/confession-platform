const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  guestName: {
    type: String,
    default: 'Anonymous Guest'
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  guestLikes: [{
    type: String  // Store guest IDs
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['confession', 'venting', 'gratitude', 'secret', 'hope', 'fear'],
    default: 'confession'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  hearts: {
    type: Number,
    default: 0
  },
  heartedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  guestHearts: [{
    type: String
  }],
  comments: [commentSchema],  // Add comments array
  createdAt: {
    type: Date,
    default: Date.now
  }
});

confessionSchema.index({ createdAt: -1 });
confessionSchema.index({ category: 1 });

module.exports = mongoose.model('Confession', confessionSchema);