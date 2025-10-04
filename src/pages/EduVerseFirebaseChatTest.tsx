import React from 'react';
import EduVerseFirebaseChat from '../components/EduVerseFirebaseChat';

const EduVerseFirebaseChatTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>EduVerse Firebase Chat Test</h1>
        <p>Test page for the EduVerse Firebase-powered chat component</p>
      </div>
      <div style={{ height: '80vh' }}>
        <EduVerseFirebaseChat />
      </div>
    </div>
  );
};

export default EduVerseFirebaseChatTest;