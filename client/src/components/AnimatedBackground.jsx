const AnimatedBackground = () => {
  const emojis = ['💭', '💜', '💖', '✨', '🌸', '🦋', '💫', '🌙', '⭐', '💝', '🌺', '🪷'];
  
  // Inline styles with animations
  const containerStyle = {
    position: 'fixed',
    inset: '0',
    zIndex: '-10',
    overflow: 'hidden',
    pointerEvents: 'none'
  };

  const blobBaseStyle = {
    position: 'absolute',
    width: '18rem',
    height: '18rem',
    borderRadius: '9999px',
    mixBlendMode: 'multiply',
    filter: 'blur(64px)',
    opacity: '0.5'
  };

  const emojiStyle = (delay, duration, left, top) => ({
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    fontSize: window.innerWidth < 768 ? '2rem' : '3rem',
    animation: `float-emoji ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`
  });

  const sparkleStyle = (delay, duration, left, top) => ({
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    width: '4px',
    height: '4px',
    backgroundColor: 'white',
    borderRadius: '50%',
    animation: `sparkle ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`
  });

  return (
    <div style={containerStyle}>
      {/* Blobs */}
      <div style={{
        ...blobBaseStyle,
        top: '5rem',
        left: '2.5rem',
        backgroundColor: '#d8b4fe',
        animation: 'blob 7s infinite'
      }} />
      <div style={{
        ...blobBaseStyle,
        top: '10rem',
        right: '2.5rem',
        backgroundColor: '#fde047',
        animation: 'blob 7s infinite 2s'
      }} />
      <div style={{
        ...blobBaseStyle,
        bottom: '-2rem',
        left: '5rem',
        backgroundColor: '#f9a8d4',
        animation: 'blob 7s infinite 4s'
      }} />
      <div style={{
        ...blobBaseStyle,
        bottom: '5rem',
        right: '10rem',
        backgroundColor: '#93c5fd',
        animation: 'blob 7s infinite 6s'
      }} />

      {/* Emojis */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={emojiStyle(
            Math.random() * 8,
            10 + Math.random() * 8,
            Math.random() * 100,
            Math.random() * 100
          )}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </div>
      ))}

      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          style={sparkleStyle(
            Math.random() * 3,
            2 + Math.random() * 3,
            Math.random() * 100,
            Math.random() * 100
          )}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;