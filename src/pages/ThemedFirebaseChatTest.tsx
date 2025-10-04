import React from 'react';
import ThemedFirebaseChat from '../components/ThemedFirebaseChat';

const ThemedFirebaseChatTest: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Themed Firebase Chat Test</h1>
        <p className="text-gray-600">Test page for the EduVerse themed Firebase chat component</p>
      </div>
      <div className="h-[70vh]">
        <ThemedFirebaseChat />
      </div>
    </div>
  );
};

export default ThemedFirebaseChatTest;