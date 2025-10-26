import { useState } from 'react';
import { MessageCircle, Send, Trash2, ThumbsUp } from 'lucide-react';
import { confessionAPI } from '../services/api';
import { formatTime, getGuestId } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ confession, onCommentAdded }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsPosting(true);
    try {
      const data = user 
        ? { text: commentText }
        : { text: commentText, guestName: guestName || 'Anonymous Guest' };
      
      const { data: updatedConfession } = await confessionAPI.addComment(confession._id, data);
      onCommentAdded(updatedConfession);
      setCommentText('');
      setGuestName('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await confessionAPI.deleteComment(confession._id, commentId);
        const { data: updatedConfession } = await confessionAPI.getAll();
        const updated = updatedConfession.confessions.find(c => c._id === confession._id);
        onCommentAdded(updated);
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const guestId = getGuestId();
      const { data: updatedConfession } = await confessionAPI.toggleCommentLike(
        confession._id,
        commentId,
        guestId
      );
      onCommentAdded(updatedConfession);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
      >
        <MessageCircle size={16} />
        <span>{confession.comments?.length || 0} Comments</span>
      </button>

      {showComments && (
        <div className="mt-4 space-y-3">
          {/* Comments List */}
          {confession.comments && confession.comments.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {confession.comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {comment.isGuest 
                        ? comment.guestName 
                        : comment.author?.displayName || 'Anonymous'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTime(comment.createdAt)}
                      </span>
                      {user && comment.author?._id === user._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-400 hover:text-red-600 dark:hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{comment.text}</p>
                  
                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    <ThumbsUp size={12} />
                    <span>{comment.likes || 0}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-2">
            {!user && (
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none"
                maxLength="30"
              />
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none"
                maxLength="500"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isPosting}
                className="w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentSection;