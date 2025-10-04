import React, { useState, useEffect } from 'react';
import { database, ref, push, onValue, getAuth, signInAnonymously } from '../services/firebase';

const FirebaseConnectionTest: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [testMessage, setTestMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const auth = getAuth();
        const userCredential = await signInAnonymously(auth);
        setUser(userCredential.user);
        setConnectionStatus('Authenticated successfully');
        
        // Test database connection
        const testRef = ref(database, 'test_connection');
        await push(testRef, {
          message: 'Connection test',
          timestamp: Date.now()
        });
        setConnectionStatus('Firebase connection successful');
        
        // Listen for test messages
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const messageList = Object.keys(data).map(key => data[key]);
            setMessages(messageList);
          }
        });
      } catch (error: any) {
        console.error('Firebase connection error:', error);
        setConnectionStatus(`Error: ${error.message}`);
      }
    };
    
    initAuth();
  }, []);

  const sendMessage = async () => {
    if (!testMessage.trim() || !user) return;
    
    try {
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        senderId: user.uid,
        senderName: 'Test User',
        text: testMessage,
        timestamp: Date.now()
      });
      setTestMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Firebase Connection Test</h2>
      <p>Status: {connectionStatus}</p>
      
      {user && (
        <div>
          <h3>Send Test Message</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message"
              style={{ flex: 1, padding: '8px' }}
            />
            <button 
              onClick={sendMessage}
              style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Send
            </button>
          </div>
          
          <h3>Recent Messages</h3>
          <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>{msg.senderName}</strong>: {msg.text}
                  <br />
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseConnectionTest;