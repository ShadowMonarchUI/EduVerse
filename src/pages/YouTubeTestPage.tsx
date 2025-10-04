import React from 'react';
import YouTubeTest from '../components/YouTubeTest';
import { useNavigate } from 'react-router-dom';

const YouTubeTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </div>
      <YouTubeTest />
    </div>
  );
};

export default YouTubeTestPage;