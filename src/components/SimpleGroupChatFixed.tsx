import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, Users, Hash, MessageCircle, Clock } from 'lucide-react';
import { database, ref, push, set, onValue } from '../services/firebase';

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

const SimpleGroupChatFixed: React.FC = () => {
  // User state
  const [name, setName] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesUnsubscribeRef = useRef<Function | null>(null);

  // Check if user has already joined
  useEffect(() => {
    const savedName = localStorage.getItem('simplechat_name');
    if (savedName) {
      setName(savedName);
      setJoined(true);
    }
  }, []);

  // Listen for messages in the general chat
  useEffect(() => {
    if (joined) {
      console.log('Setting up message listener');
      // Clean up previous listener
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      
      // Listen for messages in the default group
      const messagesRef = ref(database, 'simplechat_messages/general');
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        console.log('Message snapshot received:', snapshot.exists() ? 'Data exists' : 'No data');
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Raw message data:', data);
          const messagesList: ChatMessage[] = Object.keys(data)
            .map(key => ({
              id: key,
              ...data[key]
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          console.log('Processed messages:', messagesList);
          setMessages(messagesList);
        } else {
          console.log('No messages found');
          setMessages([]);
        }
      }, (error: any) => {
        console.error('Error listening for messages:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
      });
      
      messagesUnsubscribeRef.current = unsubscribe;
      
      return () => {
        console.log('Cleaning up message listener');
        unsubscribe();
      };
    }
  }, [joined]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (name.trim()) {
      localStorage.setItem('simplechat_name', name.trim());
      setJoined(true);
    }
  };

  const handleSendMessage = async () => {
    console.log('Attempting to send message:', newMessage);
    console.log('User name:', name);
    console.log('Joined status:', joined);
    
    if (!newMessage.trim()) {
      console.log('Message is empty');
      return;
    }
    
    if (!name) {
      console.log('User name is missing');
      alert('Please enter your name.');
      return;
    }
    
    if (!joined) {
      console.log('User is not joined');
      alert('Please join the chat first.');
      return;
    }
    
    try {
      console.log('Creating message reference');
      const newMessageRef = push(ref(database, 'simplechat_messages/general'));
      const messageId = newMessageRef.key;
      
      if (messageId) {
        const messageData: ChatMessage = {
          id: messageId,
          name: name,
          message: newMessage.trim(),
          timestamp: Date.now()
        };
        
        console.log('Sending message data:', messageData);
        
        const result = await set(newMessageRef, messageData);
        console.log('Message sent successfully, result:', result);
        setNewMessage('');
      } else {
        console.error('Failed to generate message ID');
        alert('Failed to send message. Please try again.');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'PERMISSION_DENIED') {
        alert('Permission denied. You may not have permission to send messages.');
      } else if (error.code === 'NETWORK_ERROR') {
        alert('Network error. Please check your internet connection and try again.');
      } else {
        alert('Failed to send message. Please try again. Error: ' + (error.message || 'Unknown error'));
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
    localStorage.removeItem('simplechat_name');
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
        backgroundColor: '#fff',
        borderRadius: '10px',
        overflow: 'hidden',
        fontFamily: 'Varela Round, sans-serif'
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
              Simple Group Chat
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
      overflow: 'hidden',
      fontFamily: 'Varela Round, sans-serif'
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
            Simple Group Chat
          </h1>
        </div>
      </div>
      
      <div style={{ display: 'flex', height: '550px' }}>
        {/* Groups Sidebar */}
        <div style={{ 
          width: '30%',
          borderRight: '2px dashed #1D3354',
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              margin: 0,
              color: '#1D3354',
              fontFamily: 'Varela Round, sans-serif'
            }}>
              <Users size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Groups
            </h3>
          </div>
          
          <div>
            <div
              style={{
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: '#D64045',
                color: '#fff',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontFamily: 'Varela Round, sans-serif',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Hash size={16} style={{ marginRight: '8px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>General Chat</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Everyone can message here
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Container */}
        <div style={{ 
          width: '70%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Active Group Header */}
          <div style={{ 
            padding: '15px 20px',
            borderBottom: '2px dashed #1D3354',
            backgroundColor: '#f0f0f0',
            fontFamily: 'Varela Round, sans-serif'
          }}>
            <h3 style={{ 
              margin: 0,
              color: '#1D3354'
            }}>
              <Hash size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              General Chat
            </h3>
          </div>
          
          {/* Messages Container */}
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            fontFamily: 'Varela Round, sans-serif',
            paddingLeft: '15px',
            paddingRight: '15px',
            paddingTop: '15px'
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
                <div style={{ textAlign: 'center' }}>
                  <MessageCircle size={48} style={{ 
                    color: '#D64045', 
                    marginBottom: '15px',
                    opacity: 0.7
                  }} />
                  <div>No messages yet. Be the first to start the conversation!</div>
                </div>
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
                        <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
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
              placeholder="Message #general..."
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

export default SimpleGroupChatFixed;