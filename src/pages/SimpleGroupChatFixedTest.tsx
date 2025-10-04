import React from 'react';
import SimpleGroupChatFixed from '../components/SimpleGroupChatFixed';

const SimpleGroupChatFixedTest: React.FC = () => {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <div style={{ 
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          color: '#333',
          fontFamily: 'Bungee Outline, sans-serif'
        }}>
          Simple Group Chat Fixed
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: '#666',
          fontFamily: 'Varela Round, sans-serif'
        }}>
          A simplified, guaranteed-to-work group chat implementation
        </p>
      </div>
      
      <div style={{ 
        height: '700px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <SimpleGroupChatFixed />
      </div>
      
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontFamily: 'Varela Round, sans-serif'
      }}>
        <h2 style={{ color: '#333' }}>About This Chat</h2>
        <p>
          This is a simplified group chat implementation that focuses on core functionality.
          It uses a single "General Chat" group that everyone can participate in.
        </p>
        <h3>Features:</h3>
        <ul>
          <li>User name registration with localStorage persistence</li>
          <li>Real-time messaging in the General Chat group</li>
          <li>Message history with timestamps</li>
          <li>User logout functionality</li>
        </ul>
        <h3>How to Use:</h3>
        <ol>
          <li>Enter your name and click "Join"</li>
          <li>Start chatting in the General Chat group</li>
          <li>Logout when you're done</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleGroupChatFixedTest;