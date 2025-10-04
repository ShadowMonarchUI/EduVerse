import React, { useState, useEffect } from 'react';
import { database, ref, push, set, onValue } from '../services/firebase';

const FirebaseMessageTest: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // Listen for messages
  useEffect(() => {
    const messagesRef = ref(database, 'simplechat_messages/general');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesList = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setStatus('Message cannot be empty');
      return;
    }

    try {
      setStatus('Sending message...');
      const newMessageRef = push(ref(database, 'simplechat_messages/general'));
      const messageId = newMessageRef.key;
      
      if (messageId) {
        const messageData = {
          id: messageId,
          name: 'Test User',
          message: newMessage.trim(),
          timestamp: Date.now()
        };
        
        await set(newMessageRef, messageData);
        setNewMessage('');
        setStatus('Message sent successfully!');
      } else {
        setStatus('Failed to generate message ID');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setStatus('Error: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Firebase Message Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter a test message"
          style={{ 
            padding: '10px', 
            width: '300px',
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send Test Message
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>Status:</strong> {status}
      </div>
      
      <div>
        <h2>Messages:</h2>
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          <div>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  padding: '10px', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <strong>{msg.name}</strong>: {msg.message}
                <br />
                <small>{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseMessageTest;