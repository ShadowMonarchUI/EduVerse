import React from 'react';
import EduVerseMemeChat from '../components/EduVerseMemeChat';

const EduVerseMemeChatTest: React.FC = () => {
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
          EduVerse MemeChat
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: '#666',
          fontFamily: 'Varela Round, sans-serif'
        }}>
          A functional group chat implementation inspired by MemeChat
        </p>
      </div>
      
      <div style={{ 
        height: '700px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <EduVerseMemeChat />
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
          This is a fully functional group chat implementation inspired by the MemeChat example. 
          It demonstrates the core concepts of real-time messaging with group functionality using Firebase Realtime Database.
        </p>
        <h3>Features:</h3>
        <ul>
          <li>User name registration with localStorage persistence</li>
          <li>Group creation and management</li>
          <li>Real-time messaging within groups</li>
          <li>Message history with timestamps</li>
          <li>User logout functionality</li>
        </ul>
        <h3>How to Use:</h3>
        <ol>
          <li>Enter your name and click "Join"</li>
          <li>Create a new group or join an existing one</li>
          <li>Start chatting with other users in the group</li>
          <li>Logout when you're done</li>
        </ol>
      </div>
    </div>
  );
};

export default EduVerseMemeChatTest;