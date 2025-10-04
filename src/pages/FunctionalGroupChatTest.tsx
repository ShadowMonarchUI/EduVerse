import React from 'react';
import FunctionalGroupChat from '../components/FunctionalGroupChat';

const FunctionalGroupChatTest: React.FC = () => {
  return (
    <div className="container">
      <div className="header fade-in-up" style={{ 
        textAlign: 'center',
        marginBottom: '40px',
        padding: '30px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
        border: '1px solid var(--border-primary)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 800,
          margin: '0 0 15px 0',
          background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Functional Group Chat
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          A fully functional group chat application powered by Firebase Realtime Database
        </p>
      </div>
      
      <div className="card fade-in-up" style={{ 
        padding: '0',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--bg-primary)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        height: '700px'
      }}>
        <FunctionalGroupChat />
      </div>
    </div>
  );
};

export default FunctionalGroupChatTest;