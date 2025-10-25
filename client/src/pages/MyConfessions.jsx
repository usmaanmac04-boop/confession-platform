import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import ConfessionCard from '../components/ConfessionCard';
import { confessionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

const MyConfessions = () => {
  const { user, isAuthenticated } = useAuth();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyConfessions();
    }
  }, [isAuthenticated]);

  const loadMyConfessions = async () => {
    try {
      const { data } = await confessionAPI.getAll();
      // Filter only user's confessions
      const myConfessions = data.confessions.filter(
        (c) => c.author?._id === user._id
      );
      setConfessions(myConfessions);
    } catch (error) {
      console.error('Error loading confessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfessions(confessions.filter((c) => c._id !== id));
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleUpdate = (updatedConfession) => {
  setConfessions(
    confessions.map((c) =>
      c._id === updatedConfession._id ? updatedConfession : c
    )
  );
};

  return (
    <div className="min-h-screen animated-bg relative">
      <AnimatedBackground />
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            My Confessions
          </h1>
          <p className="text-gray-600">Your personal confessions</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>You haven't posted any confessions yet.</p>
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

export default MyConfessions;