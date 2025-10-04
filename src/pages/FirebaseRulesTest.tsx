import React, { useState } from 'react';
import { database, ref, set, push } from '../services/firebase';

const FirebaseRulesTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [testData, setTestData] = useState<any>(null);

  const testBasicWrite = async () => {
    try {
      setStatus('Testing basic write to Firebase...');
      
      // Test writing to a simple path
      const testRef = ref(database, 'test/test_message');
      const testData = {
        message: 'Test message',
        timestamp: Date.now(),
        user: 'test_user'
      };
      
      await set(testRef, testData);
      setStatus('Basic write successful!');
      setTestData(testData);
    } catch (error: any) {
      console.error('Basic write failed:', error);
      setStatus(`Basic write failed: ${error.message || 'Unknown error'}`);
      setTestData(null);
    }
  };

  const testChatWrite = async () => {
    try {
      setStatus('Testing chat message write to Firebase...');
      
      // Test writing to the chat path
      const newMessageRef = push(ref(database, 'simplechat_messages/general'));
      const messageId = newMessageRef.key;
      
      if (messageId) {
        const messageData = {
          id: messageId,
          name: 'Test User',
          message: 'Test chat message',
          timestamp: Date.now()
        };
        
        await set(newMessageRef, messageData);
        setStatus('Chat message write successful!');
        setTestData(messageData);
      } else {
        setStatus('Failed to generate message ID');
        setTestData(null);
      }
    } catch (error: any) {
      console.error('Chat write failed:', error);
      setStatus(`Chat write failed: ${error.message || 'Unknown error'}`);
      setTestData(null);
    }
  };

  const testRead = async () => {
    try {
      setStatus('Testing read from Firebase...');
      
      // We can't easily read in this simple test without setting up a listener
      setStatus('Read test would require setting up a listener, but write tests are more important for your issue.');
    } catch (error: any) {
      console.error('Read test failed:', error);
      setStatus(`Read test failed: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Firebase Rules Test</h1>
      <p>This test will help identify if there are permission issues with Firebase Realtime Database.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testBasicWrite}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Basic Write
        </button>
        
        <button
          onClick={testChatWrite}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Chat Write
        </button>
        
        <button
          onClick={testRead}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Read
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>Status:</strong> {status}
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
        <strong>Test Data:</strong>
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <h3>Troubleshooting Tips:</h3>
        <ul>
          <li>If writes fail with "PERMISSION_DENIED", check your Firebase Realtime Database rules</li>
          <li>For public chat functionality, rules should allow read/write access</li>
          <li>Example rule for testing: {`{ "rules": { ".read": true, ".write": true } }`}</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseRulesTest;