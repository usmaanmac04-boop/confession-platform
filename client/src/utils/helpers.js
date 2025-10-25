// Generate or get guest ID
export const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

// Format timestamp
export const formatTime = (timestamp) => {
  const now = Date.now();
  const date = new Date(timestamp);
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Category info
export const CATEGORIES = [
  { id: 'confession', label: '💭 Confession', color: 'bg-purple-100 text-purple-700' },
  { id: 'venting', label: '😤 Venting', color: 'bg-red-100 text-red-700' },
  { id: 'gratitude', label: '🙏 Gratitude', color: 'bg-green-100 text-green-700' },
  { id: 'secret', label: '🤐 Secret', color: 'bg-blue-100 text-blue-700' },
  { id: 'hope', label: '✨ Hope', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'fear', label: '😰 Fear', color: 'bg-gray-100 text-gray-700' }
];

export const getCategoryInfo = (categoryId) => {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
};