import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, Users, Hash } from 'lucide-react';
import { database, ref, push, set, onValue, off } from '../services/firebase';

interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

const SimpleGroupChat: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesUnsubscribeRef = useRef<(() => void) | null>(null);

  // Check if user has already joined
  useEffect(() => {
    const savedName = localStorage.getItem('chat_name');
    if (savedName) {
      setName(savedName);
      setJoined(true);
    }
  }, []);

  // Listen for messages
  useEffect(() => {
    if (joined) {
      const messagesRef = ref(database, 'chats');
      messagesUnsubscribeRef.current = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = snapshot.val();
          const messagesList: Message[] = Object.keys(messagesData)
            .map(key => ({
              ...messagesData[key],
              id: key
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          
          setMessages(messagesList);
        } else {
          setMessages([]);
        }
      });
    }
    
    return () => {
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
    };
  }, [joined]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (name.trim()) {
      localStorage.setItem('chat_name', name);
      setJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && name) {
      // Create message reference
      const newMessageRef = push(ref(database, 'chats'));
      const messageId = newMessageRef.key;
      
      if (messageId) {
        // Create message data
        const messageData = {
          name: name,
          message: newMessage,
          timestamp: Date.now()
        };
        
        // Save message to database
        set(newMessageRef, messageData);
        
        setNewMessage('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_name');
    setName('');
    setJoined(false);
    setMessages([]);
    setNewMessage('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!joined) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        {/* Title Container */}
        <div style={{ 
          height: '225px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#D64045',
          borderBottom: '5px solid #fff',
          boxShadow: '0 0 30px -18px #D64045'
        }}>
          <div style={{ 
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '200px'
          }}>
            <h1 style={{ 
              color: '#fff',
              fontSize: '55px',
              letterSpacing: '2px',
              fontFamily: 'Bungee Outline, sans-serif',
              margin: 0
            }}>
              EduVerse Chat
            </h1>
          </div>
        </div>
        
        {/* Join Form */}
        <div style={{ 
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '80px'
        }}>
          <div style={{ width: '50%', height: '100%' }}>
            <div style={{ 
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={15}
                style={{
                  width: '60%',
                  height: '40px',
                  color: '#1D3354',
                  fontFamily: 'Varela Round, sans-serif',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  borderBottom: '2px dashed #1D3354'
                }}
                onKeyUp={(e) => {
                  if (name.trim() && e.key === 'Enter') {
                    handleJoin();
                  }
                }}
              />
            </div>
            <div style={{ 
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px'
            }}>
              <button
                onClick={handleJoin}
                disabled={!name.trim()}
                style={{
                  width: '60%',
                  height: '40px',
                  fontFamily: 'Varela Round, sans-serif',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: name.trim() ? '#fff' : '#ccc',
                  backgroundColor: name.trim() ? '#D64045' : '#ccc',
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.5s'
                }}
              >
                Join <span style={{ marginLeft: '8px' }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#fff',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      {/* Chat Title */}
      <div style={{ 
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D64045',
        borderBottom: '5px solid #fff',
        boxShadow: '0 0 30px -18px #D64045',
        transition: '0.8s',
        transitionTimingFunction: 'ease-in-out'
      }}>
        <div style={{ 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '200px'
        }}>
          <h1 style={{ 
            color: '#fff',
            fontSize: '47px',
            letterSpacing: '2px',
            fontFamily: 'Bungee Outline, sans-serif',
            margin: 0,
            transition: '0.8s'
          }}>
            EduVerse Chat
          </h1>
        </div>
      </div>
      
      {/* Chat Container */}
      <div style={{ 
        height: '450px',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        animation: 'fadeIn 1s linear'
      }}>
        <div style={{ width: '60%', height: '100%' }}>
          {/* Messages Container */}
          <div style={{ 
            height: '90%',
            overflowY: 'auto',
            fontFamily: 'Varela Round, sans-serif',
            paddingLeft: '15px',
            paddingRight: '15px'
          }}>
            {messages.length === 0 ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                color: '#1D3354',
                fontSize: '16px'
              }}>
                No messages yet. Be the first to start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  style={{ 
                    width: '100%', 
                    display: 'inline-block', 
                    marginBottom: '20px' 
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    display: 'inline-block', 
                    color: '#1D3354' 
                  }}>
                    <div style={{ 
                      width: '100%', 
                      display: 'inline-block' 
                    }}>
                      <p style={{ 
                        fontWeight: 'bold', 
                        fontSize: '14px',
                        margin: 0
                      }}>
                        {msg.name}
                      </p>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      display: 'inline-block',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}>
                      <p style={{ 
                        fontWeight: 'normal', 
                        fontSize: '14px', 
                        marginTop: '5px',
                        margin: 0
                      }}>
                        {msg.message}
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#888', 
                        marginTop: '3px',
                        margin: 0
                      }}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Container */}
          <div style={{ 
            height: '10%',
            borderBottom: '2px dashed #1D3354',
            backgroundColor: 'transparent',
            paddingLeft: '15px',
            paddingRight: '15px',
            fontFamily: 'Varela Round, sans-serif',
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${name}. Say something...`}
              maxLength={1000}
              style={{
                width: '90%',
                height: '100%',
                backgroundColor: 'transparent',
                color: '#1D3354',
                fontSize: '15px',
                fontFamily: 'Varela Round, sans-serif'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              style={{
                width: '10%',
                height: '100%',
                backgroundColor: 'transparent',
                textAlign: 'center',
                color: newMessage.trim() ? '#D64045' : '#ccc',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                fontSize: '18px'
              }}
            >
              <Send size={20} />
            </button>
          </div>
          
          {/* Logout Button */}
          <div style={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <button
              onClick={handleLogout}
              style={{
                color: '#D64045',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                fontFamily: 'Varela Round, sans-serif',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <LogOut size={16} />
              {name} • logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGroupChat;