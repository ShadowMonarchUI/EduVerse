import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, Hash, MessageCircle, User, LogOut, X, MoreVertical, Check } from 'lucide-react';
import { database, ref, push, set, onValue, off, update, remove } from '../services/firebase';

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: number;
  createdBy: string;
}

interface Message {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

interface GroupMember {
  userId: string;
  userName: string;
  lastSeen: number;
  isOnline: boolean;
}

const FunctionalGroupChat: React.FC = () => {
  const [currentUser, setCurrentUser] = useState({ id: 'user1', name: 'Current User' });
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesUnsubscribeRef = useRef<(() => void) | null>(null);
  const groupsUnsubscribeRef = useRef<(() => void) | null>(null);
  const membersUnsubscribeRef = useRef<(() => void) | null>(null);

  // Listen for groups
  useEffect(() => {
    const groupsRef = ref(database, 'groups');
    groupsUnsubscribeRef.current = onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const groupsData = snapshot.val();
        const groupsList: Group[] = Object.keys(groupsData).map(key => ({
          ...groupsData[key],
          id: key
        }));
        setGroups(groupsList);
        
        // Set the first group as active if none is selected and groups exist
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

  // Listen for messages in the active group
  useEffect(() => {
    if (activeGroup) {
      // Unsubscribe from previous group messages
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      
      // Subscribe to new group messages
      const messagesRef = ref(database, `messages/${activeGroup.id}`);
      messagesUnsubscribeRef.current = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = snapshot.val();
          const messagesList: Message[] = Object.keys(messagesData).map(key => ({
            ...messagesData[key],
            id: key
          })).sort((a, b) => a.timestamp - b.timestamp);
          
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

  // Listen for group members
  useEffect(() => {
    if (activeGroup) {
      // Unsubscribe from previous group members
      if (membersUnsubscribeRef.current) {
        membersUnsubscribeRef.current();
      }
      
      // Subscribe to group members
      const membersRef = ref(database, `groupMembers/${activeGroup.id}`);
      membersUnsubscribeRef.current = onValue(membersRef, (snapshot) => {
        if (snapshot.exists()) {
          const membersData = snapshot.val();
          const membersList: GroupMember[] = Object.keys(membersData).map(key => ({
            ...membersData[key],
            userId: key
          }));
          
          setGroupMembers(membersList);
        } else {
          setGroupMembers([]);
        }
      });
      
      // Update user presence to online
      update(ref(database, `groupMembers/${activeGroup.id}/${currentUser.id}`), {
        isOnline: true,
        lastSeen: Date.now()
      });
    }
    
    return () => {
      if (membersUnsubscribeRef.current) {
        membersUnsubscribeRef.current();
      }
      
      // Update user presence to offline when leaving
      if (activeGroup) {
        update(ref(database, `groupMembers/${activeGroup.id}/${currentUser.id}`), {
          isOnline: false,
          lastSeen: Date.now()
        });
      }
    };
  }, [activeGroup, currentUser.id]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeGroup) return;

    try {
      // Create message reference
      const newMessageRef = push(ref(database, `messages/${activeGroup.id}`));
      const messageId = newMessageRef.key;
      
      if (!messageId) {
        throw new Error('Failed to generate message ID');
      }
      
      // Create message data
      const messageData: Message = {
        id: messageId,
        groupId: activeGroup.id,
        userId: currentUser.id,
        userName: currentUser.name,
        content: newMessage,
        timestamp: Date.now()
      };
      
      // Save message to database
      await set(newMessageRef, messageData);
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      // Create group reference
      const newGroupRef = push(ref(database, 'groups'));
      const groupId = newGroupRef.key;
      
      if (!groupId) {
        throw new Error('Failed to generate group ID');
      }
      
      // Create group data
      const groupData: Group = {
        id: groupId,
        name: newGroupName,
        members: [currentUser.id],
        createdAt: Date.now(),
        createdBy: currentUser.id
      };
      
      // Save group to database
      await set(newGroupRef, groupData);
      
      // Add user to group members with presence info
      const memberData: GroupMember = {
        userId: currentUser.id,
        userName: currentUser.name,
        lastSeen: Date.now(),
        isOnline: true
      };
      
      await set(ref(database, `groupMembers/${groupId}/${currentUser.id}`), memberData);
      
      setActiveGroup(groupData);
      setNewGroupName('');
      setShowCreateGroup(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleJoinGroup = async (group: Group) => {
    try {
      // Check if user is already a member
      if (group.members.includes(currentUser.id)) {
        setActiveGroup(group);
        return;
      }
      
      // Add user to members list
      const updatedMembers = [...group.members, currentUser.id];
      
      // Update group members
      await set(ref(database, `groups/${group.id}/members`), updatedMembers);
      
      // Add user to group members with presence info
      const memberData: GroupMember = {
        userId: currentUser.id,
        userName: currentUser.name,
        lastSeen: Date.now(),
        isOnline: true
      };
      
      await set(ref(database, `groupMembers/${group.id}/${currentUser.id}`), memberData);
      
      setActiveGroup(group);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!activeGroup) return;

    try {
      // Remove user from members list
      const updatedMembers = activeGroup.members.filter((memberId) => memberId !== currentUser.id);
      
      // Update group members
      await set(ref(database, `groups/${activeGroup.id}/members`), updatedMembers);
      
      // Remove user from group members
      await remove(ref(database, `groupMembers/${activeGroup.id}/${currentUser.id}`));
      
      setActiveGroup(null);
      setMessages([]);
      setGroupMembers([]);
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOnlineMembersCount = () => {
    return groupMembers.filter(member => member.isOnline).length;
  };

  const isUserOnline = (userId: string) => {
    const member = groupMembers.find(m => m.userId === userId);
    return member ? member.isOnline : false;
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100%',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--border-primary)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Groups Sidebar */}
      <div style={{ 
        width: '300px',
        borderRight: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid var(--border-primary)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Users size={20} />
              Study Groups
            </h3>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="btn btn-primary"
              style={{ 
                padding: '6px 12px',
                fontSize: '0.9rem'
              }}
            >
              <Plus size={16} />
            </button>
          </div>
          
          {showCreateGroup && (
            <div style={{ 
              backgroundColor: 'var(--bg-primary)',
              padding: '15px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              marginBottom: '15px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h4 style={{ margin: 0 }}>Create Group</h4>
                <button 
                  onClick={() => setShowCreateGroup(false)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                className="form-input"
                style={{ 
                  width: '100%',
                  marginBottom: '10px'
                }}
              />
              <div style={{ 
                display: 'flex', 
                gap: '10px'
              }}>
                <button
                  onClick={handleCreateGroup}
                  className="btn btn-primary"
                  style={{ 
                    flex: 1,
                    padding: '8px'
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="btn btn-secondary"
                  style={{ 
                    flex: 1,
                    padding: '8px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div style={{ 
          flex: 1,
          overflowY: 'auto'
        }}>
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => handleJoinGroup(group)}
              style={{
                padding: '15px 20px',
                cursor: 'pointer',
                backgroundColor: activeGroup?.id === group.id 
                  ? 'var(--primary-100)' 
                  : 'transparent',
                borderBottom: '1px solid var(--border-primary)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeGroup?.id !== group.id) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeGroup?.id !== group.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '10px',
                marginBottom: '5px'
              }}>
                <Hash size={16} style={{ color: 'var(--text-secondary)' }} />
                <h4 style={{ 
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 500
                }}>
                  {group.name}
                </h4>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <Users size={14} />
                <span>{group.members.length} members</span>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          padding: '15px 20px',
          borderTop: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              {currentUser.name}
            </div>
            <div style={{ 
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              Online
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Chat Header */}
        {activeGroup && (
          <div style={{ 
            padding: '15px 20px',
            borderBottom: '1px solid var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--warning-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Hash size={20} />
              </div>
              <div>
                <h3 style={{ 
                  margin: 0,
                  fontSize: '1.2rem'
                }}>
                  {activeGroup.name}
                </h3>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  {getOnlineMembersCount()} online • {groupMembers.length} members
                </div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowGroupMenu(!showGroupMenu)}
                className="btn btn-secondary"
                style={{ 
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MoreVertical size={16} />
              </button>
              
              {showGroupMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '5px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  zIndex: 100,
                  minWidth: '180px'
                }}>
                  <button
                    onClick={() => {
                      handleLeaveGroup();
                      setShowGroupMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '12px 15px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--error-500)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--error-100)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <X size={16} />
                    Leave Group
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Messages Container */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {messages.length === 0 ? (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              padding: '20px'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--warning-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <MessageCircle size={35} style={{ color: 'var(--warning-500)' }} />
              </div>
              <h3 style={{ 
                marginBottom: '10px',
                fontSize: '1.4rem',
                color: 'var(--text-primary)'
              }}>No messages yet</h3>
              <p style={{ 
                maxWidth: '400px', 
                marginTop: '10px', 
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}>
                Be the first to start a conversation in this group!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.userId === currentUser.id ? 'flex-end' : 'flex-start',
                  gap: '12px'
                }}
              >
                {message.userId !== currentUser.id && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--warning-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <User size={18} style={{ color: 'var(--warning-600)' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: message.userId === currentUser.id 
                    ? 'var(--primary-500)' 
                    : 'var(--bg-secondary)',
                  color: message.userId === currentUser.id 
                    ? 'white' 
                    : 'var(--text-primary)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  border: message.userId !== currentUser.id 
                    ? '1px solid var(--border-primary)' 
                    : 'none'
                }}>
                  {message.userId !== currentUser.id && (
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                      color: message.userId === currentUser.id ? 'white' : 'var(--primary-600)'
                    }}>
                      <span>{message.userName}</span>
                      {isUserOnline(message.userId) && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--success-500)'
                        }}></div>
                      )}
                    </div>
                  )}
                  <div style={{ 
                    lineHeight: 1.5,
                    fontSize: '1rem'
                  }}>
                    {message.content}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    marginTop: '6px', 
                    opacity: 0.8,
                    textAlign: message.userId === currentUser.id ? 'right' : 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {message.userId === currentUser.id && isUserOnline(currentUser.id) && (
                      <Check size={12} style={{ color: 'white' }} />
                    )}
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                {message.userId === currentUser.id && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <User size={18} style={{ color: 'var(--primary-600)' }} />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div style={{ 
          padding: '15px 20px',
          borderTop: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px'
          }}>
            <div style={{ 
              flex: 1,
              position: 'relative'
            }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message #${activeGroup?.name || 'group'}`}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '24px',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  minHeight: '48px',
                  maxHeight: '120px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                disabled={!activeGroup}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !activeGroup}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--primary-500)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-600)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-500)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(99, 102, 241, 0.3)';
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionalGroupChat;