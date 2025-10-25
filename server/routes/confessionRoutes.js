const express = require('express');
const router = express.Router();
const {
  createConfession,
  getConfessions,
  toggleHeart,
  deleteConfession,
  addComment,
  deleteComment,
  toggleCommentLike
} = require('../controllers/confessionController');
const { optionalAuth, protect } = require('../middleware/auth');

// Public routes (guest + authenticated)
router.get('/', getConfessions);
router.post('/', optionalAuth, createConfession);
router.post('/:id/heart', optionalAuth, toggleHeart);
router.post('/:id/comment', optionalAuth, addComment);
router.post('/:id/comment/:commentId/like', optionalAuth, toggleCommentLike);  // Add this

// Protected routes (authenticated only)
router.delete('/:id', protect, deleteConfession);
router.delete('/:id/comment/:commentId', protect, deleteComment);

module.exports = router;