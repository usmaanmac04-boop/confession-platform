import AnimatedBackground from '../components/AnimatedBackground';
import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ConfessionForm from '../components/ConfessionForm';
import ConfessionCard from '../components/ConfessionCard';
import { confessionAPI } from '../services/api';

const Home = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadConfessions();
  }, [filter]);

  const loadConfessions = async () => {
    try {
      const params = filter ? { category: filter } : {};
      const { data } = await confessionAPI.getAll(params);
      setConfessions(data.confessions);
    } catch (error) {
      console.error('Error loading confessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfessionCreated = (newConfession) => {
    setConfessions([newConfession, ...confessions]);
  };

  const handleDelete = (id) => {
    setConfessions(confessions.filter((c) => c._id !== id));
  };

  const handleUpdate = (updatedConfession) => {
    setConfessions(
      confessions.map((c) =>
        c._id === updatedConfession._id ? updatedConfession : c
      )
    );
  };

  return (
    <div className="min-h-screen animated-bg dark:bg-gray-900 relative transition-colors duration-300">
      <AnimatedBackground />
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Anonymous Hearts
          </h1>
           <p className="text-sm sm:text-base text-gray-900 dark:text-gray-300 font-bold bg-white/80 dark:bg-gray-800/60 px-6 py-2 rounded-full inline-block backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
            Express yourself freely, without judgement and fear, your secrets are safe.
          </p>
          </div>

        {/* Post Form */}
        <ConfessionForm onConfessionCreated={handleConfessionCreated} />

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === ''
                ? 'bg-purple-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {['confession', 'venting', 'gratitude', 'secret', 'hope', 'fear'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
                filter === cat
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Confessions Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Loading confessions...
            </div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No confessions yet. Be the first to share!</p>
            </div>
          ) : (
            confessions.map((confession) => (
              <ConfessionCard
                key={confession._id}
                confession={confession}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;