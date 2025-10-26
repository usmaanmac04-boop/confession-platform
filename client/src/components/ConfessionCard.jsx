import { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { confessionAPI } from '../services/api';
import { formatTime, getCategoryInfo, getGuestId } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

const ConfessionCard = ({ confession, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [hearts, setHearts] = useState(confession.hearts);
  const [hasHearted, setHasHearted] = useState(false);
  const category = getCategoryInfo(confession.category);

  const handleHeart = async () => {
    try {
      const guestId = getGuestId();
      await confessionAPI.toggleHeart(confession._id, guestId);
      setHearts(hasHearted ? hearts - 1 : hearts + 1);
      setHasHearted(!hasHearted);
    } catch (error) {
      console.error('Error toggling heart:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this confession?')) {
      try {
        await confessionAPI.delete(confession._id);
        onDelete(confession._id);
      } catch (error) {
        console.error('Error deleting confession:', error);
        alert('Failed to delete confession');
      }
    }
  };

  const handleCommentAdded = (updatedConfession) => {
    if (onUpdate) {
      onUpdate(updatedConfession);
    }
  };

  const isOwner = user && confession.author?._id === user._id;

  return (
    <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-md p-6 hover:shadow-xl transition-all border border-white/50 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
          {category.label}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatTime(confession.createdAt)}
          </span>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-600 transition"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-4 leading-relaxed">
        {confession.text}
      </p>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleHeart}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
            hasHearted
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <Heart size={16} fill={hasHearted ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">{hearts}</span>
        </button>
        
        {confession.isGuest && (
          <span className="text-xs text-gray-400 dark:text-gray-500">Guest Post</span>
        )}
      </div>

      <CommentSection confession={confession} onCommentAdded={handleCommentAdded} />
    </div>
  );
};

export default ConfessionCard;