import React from 'react';
import EduGroupChat from '../components/EduGroupChat';

const EduGroupChatTest: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">EduVerse Group Chat</h1>
        <p className="text-gray-600 text-lg">Subject-specific study groups for collaborative learning</p>
      </div>
      <div className="h-[75vh]">
        <EduGroupChat />
      </div>
    </div>
  );
};

export default EduGroupChatTest;