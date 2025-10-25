const Confession = require('../models/Confession');

// @desc    Create confession
// @route   POST /api/confessions
// @access  Public (guest or authenticated)
const createConfession = async (req, res) => {
  try {
    const { text, category } = req.body;

    if (!text || !category) {
      return res.status(400).json({ message: 'Please provide text and category' });
    }

    const confession = await Confession.create({
      text,
      category,
      author: req.user ? req.user._id : null,
      isGuest: !req.user
    });

    res.status(201).json(confession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all confessions
// @route   GET /api/confessions
// @access  Public
const getConfessions = async (req, res) => {
  try {
    const { category, limit = 50, skip = 0 } = req.query;

    const filter = category ? { category } : {};
    
    const confessions = await Confession.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('author', 'displayName');

    const total = await Confession.countDocuments(filter);

    res.json({
      confessions,
      total,
      hasMore: total > parseInt(skip) + parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle heart on confession
// @route   POST /api/confessions/:id/heart
// @access  Public
const toggleHeart = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }

    if (req.user) {
      // Authenticated user
      const index = confession.heartedBy.indexOf(req.user._id);
      
      if (index > -1) {
        confession.heartedBy.splice(index, 1);
        confession.hearts -= 1;
      } else {
        confession.heartedBy.push(req.user._id);
        confession.hearts += 1;
      }
    } else {
      // Guest user - use guestId from request body
      const { guestId } = req.body;
      
      if (!guestId) {
        return res.status(400).json({ message: 'Guest ID required' });
      }

      const index = confession.guestHearts.indexOf(guestId);
      
      if (index > -1) {
        confession.guestHearts.splice(index, 1);
        confession.hearts -= 1;
      } else {
        confession.guestHearts.push(guestId);
        confession.hearts += 1;
      }
    }

    await confession.save();
    res.json(confession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete confession
// @route   DELETE /api/confessions/:id
// @access  Private (only author)
const deleteConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }

    // Check if user is the author
    if (confession.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this confession' });
    }

    await confession.deleteOne();
    res.json({ message: 'Confession deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to confession
// @route   POST /api/confessions/:id/comment
// @access  Public
const addComment = async (req, res) => {
  try {
    const { text, guestName } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }

    const comment = {
      text: text.trim(),
      author: req.user ? req.user._id : null,
      isGuest: !req.user,
      guestName: req.user ? undefined : (guestName || 'Anonymous Guest')
    };

    confession.comments.push(comment);
    await confession.save();

    // Populate the author for the response
    const updatedConfession = await Confession.findById(req.params.id)
      .populate('author', 'displayName')
      .populate('comments.author', 'displayName');

    res.status(201).json(updatedConfession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/confessions/:id/comment/:commentId
// @access  Private (only comment author)
const deleteComment = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }

    const comment = confession.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (!req.user || comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await confession.save();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like on comment
// @route   POST /api/confessions/:id/comment/:commentId/like
// @access  Public
const toggleCommentLike = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }

    const comment = confession.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user) {
      // Authenticated user
      const index = comment.likedBy.indexOf(req.user._id);
      
      if (index > -1) {
        comment.likedBy.splice(index, 1);
        comment.likes -= 1;
      } else {
        comment.likedBy.push(req.user._id);
        comment.likes += 1;
      }
    } else {
      // Guest user
      const { guestId } = req.body;
      
      if (!guestId) {
        return res.status(400).json({ message: 'Guest ID required' });
      }

      const index = comment.guestLikes.indexOf(guestId);
      
      if (index > -1) {
        comment.guestLikes.splice(index, 1);
        comment.likes -= 1;
      } else {
        comment.guestLikes.push(guestId);
        comment.likes += 1;
      }
    }

    await confession.save();

    // Return updated confession
    const updatedConfession = await Confession.findById(req.params.id)
      .populate('author', 'displayName')
      .populate('comments.author', 'displayName');

    res.json(updatedConfession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createConfession,
  getConfessions,
  toggleHeart,
  deleteConfession,
  addComment,
  deleteComment,
  toggleCommentLike
};