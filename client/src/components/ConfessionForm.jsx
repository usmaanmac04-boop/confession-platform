import { useState } from 'react';
import { Send } from 'lucide-react';
import { confessionAPI } from '../services/api';
import { CATEGORIES } from '../utils/helpers';

const ConfessionForm = ({ onConfessionCreated }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('confession');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsPosting(true);
    try {
      const { data } = await confessionAPI.create({ text, category });
      onConfessionCreated(data);
      setText('');
      setCategory('confession');
    } catch (error) {
      console.error('Error posting confession:', error);
      alert('Failed to post confession. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50 dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind? Share your thoughts freely..."
          className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500 rounded-xl focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none resize-none transition-colors"
          rows="4"
          maxLength="1000"
        />

        <div className="flex flex-wrap gap-2 mt-4 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.id
                  ? cat.color + ' ring-2 ring-offset-2 ring-purple-400 dark:ring-offset-gray-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {text.length}/1000 characters
          </span>
          <button
            type="submit"
            disabled={!text.trim() || isPosting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfessionForm;