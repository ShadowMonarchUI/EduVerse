import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, Users, Hash, Plus, MessageCircle } from 'lucide-react';
import { database, ref, push, set, onValue, off } from '../services/firebase';

interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: number;
}

const MemeChatGroup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesUnsubscribeRef = useRef<(() => void) | null>(null);
  const groupsUnsubscribeRef = useRef<(() => void) | null>(null);

  // Check if user has already joined
  useEffect(() => {
    const savedName = localStorage.getItem('memechat_name');
    if (savedName) {
      setName(savedName);
      setJoined(true);
    }
  }, []);

  // Listen for groups
  useEffect(() => {
    const groupsRef = ref(database, 'memechat_groups');
    groupsUnsubscribeRef.current = onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const groupsData = snapshot.val();
        const groupsList: Group[] = Object.keys(groupsData)
          .map(key => ({
            ...groupsData[key],
            id: key
          }))
          .sort((a, b) => b.createdAt - a.createdAt);
        
        setGroups(groupsList);
        
        // Set first group as active if none selected
        if (!activeGroup && groupsList.length > 0) {
          setActiveGroup(groupsList[0]);
        }
      } else {
        setGroups([]);
      }
    });
    
    return () => {
      if (groupsUnsubscribeRef.current) {
        groupsUnsubscribeRef.current();
      }
    };
  }, [activeGroup]);

  // Listen for messages in active group
  useEffect(() => {
    if (activeGroup) {
      // Unsubscribe from previous messages
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      
      const messagesRef = ref(database, `memechat_messages/${activeGroup.id}`);
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
  }, [activeGroup]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (name.trim()) {
      localStorage.setItem('memechat_name', name);
      setJoined(true);
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() && name) {
      // Create group reference
      const newGroupRef = push(ref(database, 'memechat_groups'));
      const groupId = newGroupRef.key;
      
      if (groupId) {
        // Create group data
        const groupData = {
          name: newGroupName,
          members: [name],
          createdAt: Date.now()
        };
        
        // Save group to database
        set(newGroupRef, groupData);
        
        // Set as active group
        setActiveGroup({
          id: groupId,
          ...groupData
        });
        
        setNewGroupName('');
        setShowCreateGroup(false);
      }
    }
  };

  const handleJoinGroup = (group: Group) => {
    setActiveGroup(group);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && name && activeGroup) {
      // Create message reference
      const newMessageRef = push(ref(database, `memechat_messages/${activeGroup.id}`));
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
    localStorage.removeItem('memechat_name');
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
              MemeChat Groups
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
            MemeChat Groups
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
            <button
              onClick={() => setShowCreateGroup(true)}
              style={{
                backgroundColor: '#D64045',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Plus size={16} />
            </button>
          </div>
          
          {showCreateGroup && (
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  fontFamily: 'Varela Round, sans-serif',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleCreateGroup}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#D64045',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: 'Varela Round, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#ccc',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: 'Varela Round, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div>
            {groups.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#888', 
                fontFamily: 'Varela Round, sans-serif',
                marginTop: '20px'
              }}>
                No groups yet. Create one!
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleJoinGroup(group)}
                  style={{
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: activeGroup?.id === group.id ? '#D64045' : '#fff',
                    color: activeGroup?.id === group.id ? '#fff' : '#1D3354',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                    fontFamily: 'Varela Round, sans-serif',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Hash size={16} style={{ marginRight: '8px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{group.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Chat Container */}
        <div style={{ 
          width: '70%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Active Group Header */}
          {activeGroup && (
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
                {activeGroup.name}
              </h3>
            </div>
          )}
          
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
              placeholder={activeGroup ? `Message #${activeGroup.name}...` : "Select a group to message"}
              maxLength={1000}
              disabled={!activeGroup}
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
              disabled={!newMessage.trim() || !activeGroup}
              style={{
                width: '10%',
                height: '100%',
                backgroundColor: 'transparent',
                textAlign: 'center',
                color: (newMessage.trim() && activeGroup) ? '#D64045' : '#ccc',
                cursor: (newMessage.trim() && activeGroup) ? 'pointer' : 'not-allowed',
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

export default MemeChatGroup;