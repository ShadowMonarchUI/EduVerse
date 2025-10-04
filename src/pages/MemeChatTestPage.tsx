import React from 'react';
import { Link } from 'react-router-dom';
import MemeChatGroup from '../components/MemeChatGroup';

const MemeChatTestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/dashboard" style={{ 
          color: '#3b82f6', 
          textDecoration: 'none', 
          fontFamily: 'Inter, sans-serif' 
        }}>
          ← Back to Dashboard
        </Link>
      </div>
      
      <div style={{ 
        height: '700px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <MemeChatGroup />
      </div>
      
      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h2>MemeChat Group Test</h2>
        <p>
          This page tests the MemeChatGroup component with Firebase integration.
          You can create groups, join existing ones, and send messages in real-time.
        </p>
      </div>
    </div>
  );
};

export default MemeChatTestPage;