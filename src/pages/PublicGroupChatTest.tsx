import React from 'react';
import PublicGroupChat from '../components/PublicGroupChat';

const PublicGroupChatTest: React.FC = () => {
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
          Public Group Chat
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: '#666',
          fontFamily: 'Varela Round, sans-serif'
        }}>
          A public group chat implementation with improved error handling
        </p>
      </div>
      
      <div style={{ 
        height: '700px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <PublicGroupChat />
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
          This is a public group chat implementation that focuses on reliability and error handling.
          It uses a single "General Chat" group that everyone can participate in.
        </p>
        <h3>Features:</h3>
        <ul>
          <li>User name registration with localStorage persistence</li>
          <li>Real-time messaging in the General Chat group</li>
          <li>Message history with timestamps</li>
          <li>User logout functionality</li>
          <li>Improved error handling and user feedback</li>
        </ul>
        <h3>How to Use:</h3>
        <ol>
          <li>Enter your name and click "Join"</li>
          <li>Start chatting in the General Chat group</li>
          <li>Logout when you're done</li>
        </ol>
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px'
        }}>
          <h4 style={{ color: '#856404', marginTop: 0 }}>Troubleshooting Tips:</h4>
          <p>If you're having issues sending messages, it might be due to Firebase Realtime Database rules.</p>
          <p>To fix permission issues, you may need to update your database rules to:</p>
          <pre style={{ 
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PublicGroupChatTest;