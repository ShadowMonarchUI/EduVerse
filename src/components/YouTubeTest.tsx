import React, { useState, useEffect } from 'react';
import { fetchPopularVideos } from '../services/youtubeService';

const YouTubeTest: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch videos related to "machine learning" as a test
        const videoData = await fetchPopularVideos('machine learning', 6);
        setVideos(videoData);
      } catch (err) {
        setError('Failed to fetch videos: ' + (err as Error).message);
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>YouTube API Test</h2>
      {loading && <p>Loading videos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {videos.map((video) => (
          <div key={video.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h3>{video.title}</h3>
            <p>{video.channel}</p>
            <p>{video.views} • {video.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeTest;