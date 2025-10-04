import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, Users, Hash, Plus, MessageCircle, Clock } from 'lucide-react';
import { database, ref, push, set, onValue, remove } from '../services/firebase';

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  groupId?: string;
}

interface ChatGroup {
  id: string;
  name: string;
  createdAt: number;
  createdBy: string;
}

const EduVerseMemeChat: React.FC = () => {
  // User state
  const [name, setName] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  
  // Group state
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesUnsubscribeRef = useRef<Function | null>(null);
  const groupsUnsubscribeRef = useRef<Function | null>(null);

  // Check if user has already joined
  useEffect(() => {
    const savedName = localStorage.getItem('edumeme_name');
    if (savedName) {
      setName(savedName);
      setJoined(true);
    }
  }, []);

  // Listen for groups and create default group if none exist
  useEffect(() => {
    console.log('Setting up groups listener');
    const groupsRef = ref(database, 'edumeme_groups');
    const unsubscribe = onValue(groupsRef, async (snapshot) => {
      console.log('Groups snapshot received:', snapshot.exists() ? snapshot.val() : 'No data');
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Raw groups data:', data);
        
        // Convert data to array
        const groupsList: ChatGroup[] = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .sort((a, b) => b.createdAt - a.createdAt);
          
        console.log('Processed groups list:', groupsList);
        setGroups(groupsList);
        
        // Set first group as active if none selected and groups exist
        if (!activeGroup && groupsList.length > 0) {
          console.log('Setting active group to first in list');
          setActiveGroup(groupsList[0]);
        }
      } else {
        console.log('No groups found in database');
        setGroups([]);
        
        // Create default group if none exist
        await createDefaultGroup();
      }
    }, (error: any) => {
      console.error('Error listening for groups:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Try to create default group even if there's an error
      createDefaultGroup();
    });
    
    groupsUnsubscribeRef.current = unsubscribe;
    
    return () => {
      console.log('Cleaning up groups listener');
      unsubscribe();
    };
  }, []);
  
  // Create default group function
  const createDefaultGroup = async (): Promise<ChatGroup | null> => {
    try {
      console.log('Creating default group');
      const defaultGroupRef = ref(database, 'edumeme_groups/default');
      
      // Check if default group already exists
      const defaultGroupSnapshot = await new Promise<any>((resolve, reject) => {
        const unsubscribe = onValue(defaultGroupRef, (snapshot) => {
          resolve(snapshot);
          unsubscribe();
        }, reject);
      });
      
      if (!defaultGroupSnapshot.exists()) {
        // Create default group
        const defaultGroupData: ChatGroup = {
          id: 'default',
          name: 'General Chat',
          createdAt: Date.now(),
          createdBy: 'System'
        };
        
        await set(defaultGroupRef, defaultGroupData);
        console.log('Default group created');
        
        // Set default group as active
        setActiveGroup(defaultGroupData);
        return defaultGroupData;
      } else {
        // Default group exists, set it as active
        const data = defaultGroupSnapshot.val();
        const defaultGroup: ChatGroup = {
          id: 'default',
          name: data.name,
          createdAt: data.createdAt,
          createdBy: data.createdBy
        };
        
        console.log('Default group already exists:', defaultGroup);
        setActiveGroup(defaultGroup);
        return defaultGroup;
      }
    } catch (error: any) {
      console.error('Error creating default group:', error);
      console.error('Error message:', error.message || 'Unknown error');
      return null;
    }
  };

  // Listen for messages in active group
  useEffect(() => {
    if (activeGroup) {
      // Clean up previous listener
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      
      const messagesRef = ref(database, `edumeme_messages/${activeGroup.id}`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const messagesList: ChatMessage[] = Object.keys(data)
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
      
      messagesUnsubscribeRef.current = unsubscribe;
      
      return () => unsubscribe();
    }
  }, [activeGroup]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (name.trim()) {
      localStorage.setItem('edumeme_name', name.trim());
      setJoined(true);
    }
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim() && name) {
      // Prevent creating a group with reserved name
      if (newGroupName.trim().toLowerCase() === 'general chat') {
        alert('This group name is reserved. Please choose a different name.');
        return;
      }
      
      try {
        console.log('Creating group with name:', newGroupName.trim());
        
        // Create group reference
        const newGroupRef = push(ref(database, 'edumeme_groups'));
        const groupId = newGroupRef.key;
        
        if (groupId) {
          const groupData: ChatGroup = {
            id: groupId,
            name: newGroupName.trim(),
            createdAt: Date.now(),
            createdBy: name
          };
          
          console.log('Group data to save:', groupData);
          
          // Try to set the data with better error handling
          console.log('Attempting to save group data to database');
          await set(newGroupRef, groupData)
            .then(() => {
              console.log('Group created successfully');
              console.log('New group data:', groupData);
              setActiveGroup(groupData);
              setShowCreateGroup(false);
              setNewGroupName('');
            })
            .catch((error) => {
              console.error('Error in set operation:', error);
              throw error;
            });
        } else {
          console.error('Failed to generate group ID');
          alert('Failed to generate group ID. Please try again.');
        }
      } catch (error: any) {
        console.error('Error creating group:', error);
        console.error('Error message:', error.message || 'Unknown error');
        console.error('Error code:', error.code);
        
        // Show specific error messages to user
        if (error.code === 'PERMISSION_DENIED') {
          alert('Permission denied. You may not have permission to create groups. Please contact the administrator.');
        } else if (error.code === 'NETWORK_ERROR') {
          alert('Network error. Please check your internet connection and try again.');
        } else {
          alert('Failed to create group. Please try again. Error: ' + (error.message || 'Unknown error'));
        }
      }
    } else {
      console.log('Group name or user name is empty');
      console.log('newGroupName:', newGroupName);
      console.log('name:', name);
      alert('Please enter a group name and make sure you are logged in.');
    }
  };

  const handleJoinGroup = (group: ChatGroup) => {
    console.log('Joining group:', group);
    setActiveGroup(group);
  };
  
  // Function to join the default group
  const handleJoinDefaultGroup = async (): Promise<ChatGroup | null> => {
    try {
      console.log('Joining default group');
      const defaultGroupRef = ref(database, 'edumeme_groups/default');
      
      // Get default group data
      const defaultGroupSnapshot = await new Promise<any>((resolve, reject) => {
        const unsubscribe = onValue(defaultGroupRef, (snapshot) => {
          resolve(snapshot);
          unsubscribe();
        }, reject);
      });
      
      if (defaultGroupSnapshot.exists()) {
        const data = defaultGroupSnapshot.val();
        const defaultGroup: ChatGroup = {
          id: 'default',
          name: data.name,
          createdAt: data.createdAt,
          createdBy: data.createdBy
        };
        
        console.log('Setting active group to default:', defaultGroup);
        setActiveGroup(defaultGroup);
        return defaultGroup;
      } else {
        console.log('Default group does not exist');
        // Try to create it
        await createDefaultGroup();
        // After creating, try to get it again
        const newDefaultGroupSnapshot = await new Promise<any>((resolve, reject) => {
          const unsubscribe = onValue(defaultGroupRef, (snapshot) => {
            resolve(snapshot);
            unsubscribe();
          }, reject);
        });
        
        if (newDefaultGroupSnapshot.exists()) {
          const data = newDefaultGroupSnapshot.val();
          const defaultGroup: ChatGroup = {
            id: 'default',
            name: data.name,
            createdAt: data.createdAt,
            createdBy: data.createdBy
          };
          
          console.log('Setting active group to newly created default:', defaultGroup);
          setActiveGroup(defaultGroup);
          return defaultGroup;
        }
        return null;
      }
    } catch (error: any) {
      console.error('Error joining default group:', error);
      console.error('Error message:', error.message || 'Unknown error');
      return null;
    }
  };

  const handleSendMessage = async () => {
    console.log('Attempting to send message:', newMessage);
    console.log('Current user:', name);
    console.log('Active group:', activeGroup);
    
    // If no active group, try to join the default group first
    let currentGroup = activeGroup;
    if (!currentGroup) {
      console.log('No active group, trying to join default group');
      const defaultGroup = await handleJoinDefaultGroup();
      currentGroup = defaultGroup || activeGroup;
      console.log('After joining default group, current group is:', currentGroup);
    }
    
    if (newMessage.trim() && name && currentGroup) {
      console.log('Sending message to group:', currentGroup.id);
      const newMessageRef = push(ref(database, `edumeme_messages/${currentGroup.id}`));
      const messageId = newMessageRef.key;
      
      if (messageId) {
        const messageData: ChatMessage = {
          id: messageId,
          name: name,
          message: newMessage.trim(),
          timestamp: Date.now(),
          groupId: currentGroup.id
        };
        
        console.log('Message data to send:', messageData);
        
        set(newMessageRef, messageData)
          .then(() => {
            console.log('Message sent successfully');
            setNewMessage('');
          })
          .catch(error => {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
          });
      } else {
        console.error('Failed to generate message ID');
        alert('Failed to send message. Please try again.');
      }
    } else {
      console.log('Cannot send message - missing data:');
      console.log('  Message:', newMessage.trim() ? 'OK' : 'EMPTY');
      console.log('  User:', name ? 'OK' : 'MISSING');
      console.log('  Group:', currentGroup ? 'OK' : 'MISSING');
      
      if (!currentGroup) {
        alert('Please select a group before sending a message.');
      } else if (!name) {
        alert('Please enter your name.');
      } else if (!newMessage.trim()) {
        alert('Please enter a message.');
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
    localStorage.removeItem('edumeme_name');
    setName('');
    setJoined(false);
    setMessages([]);
    setNewMessage('');
    setActiveGroup(null);
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
            EduVerse Chat
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
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginBottom: '10px', 
                fontStyle: 'italic' 
              }}>
                Note: 'General Chat' is reserved for everyone
              </div>
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
            {/* Default Group */}
            <div
              onClick={handleJoinDefaultGroup}
              style={{
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: activeGroup?.id === 'default' ? '#D64045' : '#fff',
                color: activeGroup?.id === 'default' ? '#fff' : '#1D3354',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '2px solid #1D3354',
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
            
            {/* User-created groups */}
            {groups.filter(group => group.id !== 'default').length > 0 ? (
              groups.filter(group => group.id !== 'default').map((group) => (
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
                      by {group.createdBy}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              groups.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#888', 
                  fontFamily: 'Varela Round, sans-serif',
                  marginTop: '20px'
                }}>
                  No user-created groups yet. Create one!
                </div>
              )
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

export default EduVerseMemeChat;