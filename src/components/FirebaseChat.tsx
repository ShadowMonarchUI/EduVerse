import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, MessageCircle, Clock } from 'lucide-react';
import { database, ref, push, onValue, getAuth, signInAnonymously } from '../services/firebase';

interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

const FirebaseChat: React.FC = () => {
  // User state
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesUnsubscribeRef = useRef<Function | null>(null);

  // Initialize anonymous authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        const auth = getAuth();
        const userCredential = await signInAnonymously(auth);
        setUser(userCredential.user);
        
        // Check if user has already joined
        const savedName = localStorage.getItem('firebasechat_name');
        if (savedName) {
          setName(savedName);
          setJoined(true);
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication: ' + (error.message || 'Unknown error'));
      }
    };
    
    initAuth();
  }, []);

  // Listen for messages
  useEffect(() => {
    if (joined) {
      // Clean up previous listener
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      
      // Listen for messages
      const messagesRef = ref(database, 'messages');
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const messagesData = snapshot.val();
        if (messagesData) {
          const messagesList: ChatMessage[] = Object.keys(messagesData)
            .map(key => ({
              ...messagesData[key]
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          setMessages(messagesList);
        } else {
          setMessages([]);
        }
      }, (error) => {
        console.error("Error listening for messages:", error);
        setError('Error listening for messages: ' + (error.message || 'Unknown error'));
      });
      
      messagesUnsubscribeRef.current = unsubscribe;
      
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [joined]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (name.trim() && user) {
      localStorage.setItem('firebasechat_name', name.trim());
      setJoined(true);
      setError('');
    } else if (!user) {
      setError('Authentication not initialized. Please try again.');
    } else {
      setError('Please enter your name');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setError('Please enter a message');
      return;
    }
    
    if (!name) {
      setError('Please enter your name');
      return;
    }
    
    if (!user) {
      setError('Authentication not initialized');
      return;
    }
    
    if (!joined) {
      setError('Please join the chat first');
      return;
    }
    
    try {
      setError('');
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        senderId: user.uid,
        senderName: name,
        text: newMessage.trim(),
        timestamp: Date.now()
      });
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError('Failed to send message: ' + (error.message || 'Unknown error'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('firebasechat_name');
    setName('');
    setJoined(false);
    setMessages([]);
    setNewMessage('');
    setError('');
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
              Firebase Chat
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
            {error && (
              <div style={{ 
                color: '#D64045', 
                textAlign: 'center', 
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#ffebee',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}
            
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
                disabled={!name.trim() || !user}
                style={{
                  width: '60%',
                  height: '40px',
                  fontFamily: 'Varela Round, sans-serif',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: name.trim() && user ? '#fff' : '#ccc',
                  backgroundColor: name.trim() && user ? '#D64045' : '#ccc',
                  cursor: name.trim() && user ? 'pointer' : 'not-allowed',
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
            Firebase Chat
          </h1>
        </div>
      </div>
      
      <div style={{ display: 'flex', height: '550px' }}>
        {/* Chat Info Sidebar */}
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
              <MessageCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Chat Room
            </h3>
          </div>
          
          <div style={{ 
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <User size={16} style={{ 
                marginRight: '8px', 
                color: '#D64045' 
              }} />
              <div>
                <div style={{ 
                  fontWeight: 'bold',
                  color: '#1D3354'
                }}>
                  {name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#888' 
                }}>
                  Online
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
              messages.map((msg, index) => (
                <div 
                  key={index}
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
                        {msg.senderName}
                        {msg.senderId === user?.uid && (
                          <span style={{ 
                            fontSize: '12px', 
                            fontWeight: 'normal',
                            marginLeft: '8px',
                            color: '#D64045'
                          }}>
                            (You)
                          </span>
                        )}
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
                        {msg.text}
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
          
          {/* Error Message */}
          {error && (
            <div style={{ 
              padding: '10px 20px',
              color: '#D64045',
              backgroundColor: '#ffebee',
              borderBottom: '1px solid #D64045'
            }}>
              {error}
            </div>
          )}
          
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
              placeholder="Type your message..."
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
              onClick={sendMessage}
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

export default FirebaseChat;