import React from 'react';
import SimpleGroupChat from '../components/SimpleGroupChat';

const SimpleGroupChatTest: React.FC = () => {
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
          Simple Group Chat
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: '#666',
          fontFamily: 'Varela Round, sans-serif'
        }}>
          A lightweight group chat implementation inspired by MemeChat
        </p>
      </div>
      
      <div style={{ 
        height: '700px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <SimpleGroupChat />
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
          This is a simplified group chat implementation inspired by the MemeChat example. 
          It demonstrates the core concepts of real-time messaging using Firebase Realtime Database.
        </p>
        <h3>Features:</h3>
        <ul>
          <li>User name registration</li>
          <li>Real-time messaging</li>
          <li>Message history</li>
          <li>User logout functionality</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleGroupChatTest;