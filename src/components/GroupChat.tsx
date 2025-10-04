import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, MessageCircle, Clock, BookOpen, Users, Hash, Bell, Settings, Search, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { database, ref, push, onValue, getAuth, signInAnonymously } from '../services/firebase';

interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface ChatGroup {
  id: string;
  name: string;
  members: number;
  lastMessage?: string;
  lastMessageTime?: number;
}

const GroupChat: React.FC = () => {
  // User state
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeGroup, setActiveGroup] = useState<string>('general');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Groups data
  const [groups] = useState<ChatGroup[]>([
    { id: 'general', name: 'General Discussion', members: 24 },
    { id: 'math', name: 'Mathematics', members: 18 },
    { id: 'science', name: 'Science', members: 15 },
    { id: 'literature', name: 'Literature', members: 12 },
    { id: 'history', name: 'History', members: 9 },
  ]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesUnsubscribeRef = useRef<Function | null>(null);

  // Initialize anonymous authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        const auth = getAuth();
        // Check if there's already an authenticated user
        if (auth.currentUser) {
          setUser(auth.currentUser);
          const savedName = localStorage.getItem('edugroupchat_name');
          if (savedName) {
            setName(savedName);
            setJoined(true);
          }
        } else {
          // Try to sign in anonymously
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
          
          // Check if user has already joined
          const savedName = localStorage.getItem('edugroupchat_name');
          if (savedName) {
            setName(savedName);
            setJoined(true);
          }
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        // If Firebase auth fails, create a mock user
        const mockUser = {
          uid: 'mock-user-' + Date.now(),
          displayName: null,
          email: null
        };
        setUser(mockUser);
        setError('Using mock authentication. Some features may be limited.');
        
        // Check if user has already joined
        const savedName = localStorage.getItem('edugroupchat_name');
        if (savedName) {
          setName(savedName);
          setJoined(true);
        }
      } finally {
        setIsLoading(false);
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
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!user) {
      setError('Authentication not initialized. Please try again.');
      return;
    }
    
    localStorage.setItem('edugroupchat_name', name.trim());
    setJoined(true);
    setError('');
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
        senderId: user.uid || 'mock-user',
        senderName: name,
        text: newMessage.trim(),
        timestamp: Date.now()
      });
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      // If Firebase operation fails, show appropriate error
      if (error.code === 'auth/admin-restricted-operation' || error.code === 'PERMISSION_DENIED') {
        setError('Chat service temporarily unavailable. Message not sent.');
      } else {
        setError('Failed to send message: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('edugroupchat_name');
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

  const switchGroup = (groupId: string) => {
    setActiveGroup(groupId);
    // In a real app, we would load messages for this group
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-8)',
        border: '1px solid var(--border-primary)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          border: '4px solid rgba(59, 130, 246, 0.3)',
          borderTopColor: 'var(--primary-500)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: 'var(--space-6)'
        }}></div>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-xl)'
        }}>Setting up your learning chat...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!joined) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-8)',
        border: '1px solid var(--border-primary)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-10)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)',
            color: 'white',
            marginBottom: 'var(--space-6)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <Users size={40} />
          </div>
          <h1 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-extrabold)',
            marginBottom: 'var(--space-3)',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            EduVerse Groups
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-lg)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Join subject-specific study groups and collaborate with fellow learners
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: 'var(--space-8)',
            padding: 'var(--space-4)',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            maxWidth: '500px',
            margin: '0 auto var(--space-8)',
            color: '#dc2626'
          }}>
            <Bell style={{ marginRight: 'var(--space-3)' }} size={24} />
            <span>{error}</span>
          </div>
        )}

        {/* Join Form */}
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          width: '100%',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-8)',
          border: '1px solid var(--border-primary)'
        }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label htmlFor="name" style={{
              display: 'block',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)'
            }}>
              Enter your name to join
            </label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute',
                left: 'var(--space-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} size={20} />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                style={{
                  width: '100%',
                  paddingLeft: 'calc(var(--space-12) + var(--space-4))',
                  paddingRight: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: 'var(--text-lg)',
                  transition: 'all var(--transition-fast)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)'
                }}
                onKeyUp={(e) => {
                  if (name.trim() && e.key === 'Enter') {
                    handleJoin();
                  }
                }}
              />
            </div>
          </div>
          
          <button
            onClick={handleJoin}
            disabled={!name.trim()}
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-xl)',
              fontWeight: 'var(--font-bold)',
              fontSize: 'var(--text-lg)',
              transition: 'all var(--transition-normal)',
              transform: name.trim() ? 'none' : 'none',
              boxShadow: name.trim() ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none',
              background: name.trim() 
                ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)' 
                : 'var(--neutral-200)',
              color: name.trim() ? 'white' : 'var(--neutral-500)',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              border: 'none'
            }}
          >
            Join Learning Groups
          </button>
          
          <div style={{
            marginTop: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)'
          }}>
            <p>Connect with peers in subject-specific study groups</p>
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
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      border: '1px solid var(--border-primary)',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-700) 100%)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              marginRight: 'var(--space-4)'
            }}>
              <Users size={24} />
            </div>
            <div>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'white'
              }}>EduVerse Learning Groups</h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 'var(--text-sm)'
              }}>Collaborative learning platform</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button style={{
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}>
              <Settings size={20} />
            </button>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2) var(--space-4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LogOut size={18} style={{ marginRight: 'var(--space-2)' }} />
              <span>Leave</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Groups Sidebar */}
        <div style={{
          width: '320px',
          borderRight: '1px solid var(--border-primary)',
          background: 'linear-gradient(180deg, var(--primary-50) 0%, var(--secondary-50) 100%)',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search groups..."
                style={{
                  width: '100%',
                  paddingLeft: 'calc(var(--space-3) + var(--space-6))',
                  paddingRight: 'var(--space-4)',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: 'var(--text-base)',
                  transition: 'all var(--transition-fast)'
                }}
              />
            </div>
          </div>
          
          {/* Groups List */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Hash size={20} style={{ 
                marginRight: 'var(--space-2)', 
                color: 'var(--primary-500)' 
              }} />
              Study Groups
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => switchGroup(group.id)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-xl)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    background: activeGroup === group.id
                      ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)'
                      : 'var(--bg-card)',
                    color: activeGroup === group.id ? 'white' : 'var(--text-primary)',
                    boxShadow: activeGroup === group.id ? 'var(--shadow-lg)' : 'none',
                    border: activeGroup === group.id 
                      ? 'none' 
                      : '1px solid var(--border-primary)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 'var(--space-3)',
                        background: activeGroup === group.id 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'var(--primary-100)',
                        color: activeGroup === group.id 
                          ? 'white' 
                          : 'var(--primary-600)'
                      }}>
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 style={{
                          fontWeight: 'var(--font-semibold)',
                          color: activeGroup === group.id ? 'white' : 'var(--text-primary)'
                        }}>
                          {group.name}
                        </h4>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          color: activeGroup === group.id 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'var(--text-secondary)'
                        }}>
                          {group.members} members
                        </p>
                      </div>
                    </div>
                    {activeGroup === group.id && (
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: 'var(--radius-full)',
                        background: 'white'
                      }}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* User Profile */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-lg)',
                  marginRight: 'var(--space-3)'
                }}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)'
                  }}>{name}</div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--success-500)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--success-500)',
                      marginRight: 'var(--space-2)'
                    }}></div>
                    Online - Learning
                  </div>
                </div>
                <button style={{
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}>
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Group Header */}
          <div style={{
            borderBottom: '1px solid var(--border-primary)',
            padding: 'var(--space-4)',
            background: 'linear-gradient(90deg, var(--primary-50) 0%, var(--secondary-50) 100%)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'var(--font-bold)',
                  marginRight: 'var(--space-3)'
                }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 style={{
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-lg)'
                  }}>
                    {groups.find(g => g.id === activeGroup)?.name || 'General Discussion'}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)'
                  }}>
                    {groups.find(g => g.id === activeGroup)?.members || 0} members
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <button style={{
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}>
                  <Search size={20} />
                </button>
                <button style={{
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}>
                  <Bell size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-4)',
            background: 'linear-gradient(180deg, white 0%, var(--primary-50) 100%)'
          }}>
            {messages.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: 'var(--space-12) 0'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '96px',
                  height: '96px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-100)',
                  color: 'var(--primary-500)',
                  marginBottom: 'var(--space-6)'
                }}>
                  <MessageCircle size={48} />
                </div>
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-3)'
                }}>No messages yet</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  maxWidth: '500px',
                  marginBottom: 'var(--space-6)'
                }}>
                  Be the first to start the conversation in this study group! Share your thoughts and help others learn.
                </p>
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  maxWidth: '500px'
                }}>
                  <h4 style={{
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-3)'
                  }}>Study Group Tips</h4>
                  <ul style={{
                    textAlign: 'left',
                    color: 'var(--text-secondary)',
                    padding: 0,
                    margin: 0,
                    listStyle: 'none'
                  }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-500)',
                        marginTop: 'var(--space-2)',
                        marginRight: 'var(--space-3)'
                      }}></div>
                      <span>Ask questions about concepts you're struggling with</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-500)',
                        marginTop: 'var(--space-2)',
                        marginRight: 'var(--space-3)'
                      }}></div>
                      <span>Share helpful resources and study materials</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-500)',
                        marginTop: 'var(--space-2)',
                        marginRight: 'var(--space-3)'
                      }}></div>
                      <span>Explain concepts to help reinforce your own learning</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.senderId === (user?.uid || 'mock-user') ? 'flex-end' : 'flex-start',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                  >
                    {msg.senderId !== (user?.uid || 'mock-user') && (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'var(--font-bold)',
                        marginRight: 'var(--space-3)',
                        marginTop: 'var(--space-1)',
                        flexShrink: 0
                      }}>
                        {msg.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div 
                      style={{
                        maxWidth: '400px',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--space-5) var(--space-5)',
                        boxShadow: 'var(--shadow-sm)',
                        background: msg.senderId === (user?.uid || 'mock-user')
                          ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)'
                          : 'var(--bg-card)',
                        color: msg.senderId === (user?.uid || 'mock-user') ? 'white' : 'var(--text-primary)',
                        borderBottomRightRadius: msg.senderId === (user?.uid || 'mock-user') ? 0 : 'var(--radius-2xl)',
                        borderBottomLeftRadius: msg.senderId === (user?.uid || 'mock-user') ? 'var(--radius-2xl)' : 0,
                        border: msg.senderId === (user?.uid || 'mock-user') ? 'none' : '1px solid var(--border-primary)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 'var(--space-1)'
                      }}>
                        <span style={{
                          fontWeight: 'var(--font-bold)',
                          color: msg.senderId === (user?.uid || 'mock-user') ? 'white' : 'var(--text-primary)'
                        }}>
                          {msg.senderName}
                        </span>
                        {msg.senderId === (user?.uid || 'mock-user') && (
                          <span style={{
                            marginLeft: 'var(--space-2)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-medium)'
                          }}>(You)</span>
                        )}
                      </div>
                      <p style={{
                        marginBottom: 'var(--space-2)',
                        color: msg.senderId === (user?.uid || 'mock-user') ? 'white' : 'var(--text-secondary)'
                      }}>
                        {msg.text}
                      </p>
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: msg.senderId === (user?.uid || 'mock-user') ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-tertiary)',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Clock size={12} style={{ marginRight: 'var(--space-1)' }} />
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                  @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              background: '#fef2f2',
              borderTop: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              color: '#dc2626'
            }}>
              <Bell style={{ marginRight: 'var(--space-2)' }} size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Input Area */}
          <div style={{
            borderTop: '1px solid var(--border-primary)',
            padding: 'var(--space-4)',
            background: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-2)', 
                marginRight: 'var(--space-3)' 
              }}>
                <button style={{
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}>
                  <Paperclip size={20} />
                </button>
                <button style={{
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}>
                  <Smile size={20} />
                </button>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... Use @ to mention someone"
                  style={{
                    width: '100%',
                    padding: 'var(--space-4) var(--space-5)',
                    paddingRight: '120px',
                    backgroundColor: 'var(--neutral-100)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-2xl)',
                    fontSize: 'var(--text-base)',
                    transition: 'all var(--transition-fast)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  fontSize: 'var(--text-sm)'
                }}>
                  SHIFT + ENTER for new line
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  marginLeft: 'var(--space-3)',
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-normal)',
                  transform: newMessage.trim() ? 'none' : 'none',
                  background: newMessage.trim()
                    ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)'
                    : 'var(--neutral-200)',
                  color: newMessage.trim() ? 'white' : 'var(--neutral-500)',
                  border: 'none',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: newMessage.trim() ? 'var(--shadow-lg)' : 'none'
                }}
              >
                <Send size={22} />
              </button>
            </div>
            <div style={{
              marginTop: 'var(--space-3)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Subject-specific study groups for collaborative learning</span>
              <span>Press ENTER to send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;