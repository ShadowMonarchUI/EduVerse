import React from 'react';
import FirebaseChat from '../components/FirebaseChat';

const FirebaseChatTest: React.FC = () => {
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
          Firebase Chat
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: '#666',
          fontFamily: 'Varela Round, sans-serif'
        }}>
          A Firebase-powered group chat implementation
        </p>
      </div>
      
      <div style={{ 
        height: '700px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <FirebaseChat />
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
          This is a Firebase-powered chat implementation that follows Firebase best practices.
          It uses anonymous authentication and the recommended data structure.
        </p>
        <h3>Features:</h3>
        <ul>
          <li>Anonymous authentication</li>
          <li>Real-time messaging</li>
          <li>Message history with timestamps</li>
          <li>User logout functionality</li>
          <li>Improved error handling and user feedback</li>
        </ul>
        <h3>How to Use:</h3>
        <ol>
          <li>Enter your name and click "Join"</li>
          <li>Start chatting with other users</li>
          <li>Logout when you're done</li>
        </ol>
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px'
        }}>
          <h4 style={{ color: '#856404', marginTop: 0 }}>Firebase Database Rules:</h4>
          <p>For this chat to work properly, your Firebase Realtime Database rules should allow authenticated users to read and write:</p>
          <pre style={{ 
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
{`{
  "rules": {
    "messages": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FirebaseChatTest;