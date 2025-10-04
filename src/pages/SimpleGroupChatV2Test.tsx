import React from 'react';
import SimpleGroupChatV2 from '../components/SimpleGroupChatV2';

const SimpleGroupChatV2Test: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Simple Group Chat V2</h1>
        <p className="text-gray-600">A new implementation of group chat with a modern UI</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '700px' }}>
        <SimpleGroupChatV2 />
      </div>
      
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About This Implementation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>User authentication with name registration</li>
              <li>Group creation and management</li>
              <li>Real-time messaging with Firebase</li>
              <li>Message history with timestamps</li>
              <li>Responsive design with modern UI</li>
              <li>Smooth scrolling to latest messages</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Technical Details</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Built with React and TypeScript</li>
              <li>Firebase Realtime Database integration</li>
              <li>Modern UI with Tailwind CSS</li>
              <li>Real-time listeners for groups and messages</li>
              <li>Local storage for user persistence</li>
              <li>Responsive layout for all screen sizes</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">How to Use</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>Enter your name to join the chat</li>
            <li>Create a new group or join an existing one</li>
            <li>Start sending messages to your group</li>
            <li>Logout when you're done</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SimpleGroupChatV2Test;