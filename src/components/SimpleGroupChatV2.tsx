import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, Users, Hash, Plus, MessageSquare, Clock } from 'lucide-react';
import { database, ref, push, set, onValue } from '../services/firebase';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

interface ChatGroup {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
}

const SimpleGroupChatV2: React.FC = () => {
  // User state
  const [userName, setUserName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Group state
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showGroupForm, setShowGroupForm] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  
  // Message state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const groupUnsubscribeRef = useRef<Function | null>(null);
  const messageUnsubscribeRef = useRef<Function | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserName = localStorage.getItem('simplechat_user');
    if (savedUserName) {
      setUserName(savedUserName);
      setIsAuthenticated(true);
    }
  }, []);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load groups
  useEffect(() => {
    const groupsRef = ref(database, 'simplechat_groups');
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const groupsList: ChatGroup[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setGroups(groupsList);
        
        // If no active group and groups exist, select the first one
        if (!activeGroupId && groupsList.length > 0) {
          setActiveGroupId(groupsList[0].id);
        }
      } else {
        setGroups([]);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Load messages for active group
  useEffect(() => {
    if (!activeGroupId) return;
    
    // Clean up previous listener
    if (messageUnsubscribeRef.current) {
      messageUnsubscribeRef.current();
    }
    
    const messagesRef = ref(database, `simplechat_messages/${activeGroupId}`);
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
    
    messageUnsubscribeRef.current = unsubscribe;
    
    return () => unsubscribe();
  }, [activeGroupId]);

  // Handle user login
  const handleLogin = () => {
    if (userName.trim()) {
      localStorage.setItem('simplechat_user', userName.trim());
      setIsAuthenticated(true);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('simplechat_user');
    setIsAuthenticated(false);
    setUserName('');
    setMessages([]);
    setNewMessage('');
  };

  // Create a new group
  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !userName) return;
    
    const newGroupRef = push(ref(database, 'simplechat_groups'));
    const groupId = newGroupRef.key;
    
    if (groupId) {
      const groupData: ChatGroup = {
        id: groupId,
        name: newGroupName.trim(),
        createdBy: userName,
        createdAt: Date.now()
      };
      
      set(newGroupRef, groupData)
        .then(() => {
          setActiveGroupId(groupId);
          setShowGroupForm(false);
          setNewGroupName('');
        })
        .catch(error => {
          console.error('Error creating group:', error);
        });
    }
  };

  // Send a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeGroupId || !userName) return;
    
    const newMessageRef = push(ref(database, `simplechat_messages/${activeGroupId}`));
    const messageId = newMessageRef.key;
    
    if (messageId) {
      const messageData: ChatMessage = {
        id: messageId,
        userId: userName,
        userName: userName,
        text: newMessage.trim(),
        timestamp: Date.now()
      };
      
      set(newMessageRef, messageData)
        .then(() => {
          setNewMessage('');
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If user is not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <MessageSquare className="text-indigo-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Simple Group Chat</h1>
            <p className="text-gray-600">Join groups and chat with others</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                maxLength={20}
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={!userName.trim()}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                userName.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <MessageSquare className="mr-2" size={24} />
            Simple Group Chat
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-full transition"
          >
            <LogOut size={16} className="mr-1" />
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Groups Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <Users size={18} className="mr-2" />
                Groups
              </h2>
              <button
                onClick={() => setShowGroupForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-full transition"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {showGroupForm && (
              <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
                  maxLength={30}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateGroup}
                    className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowGroupForm(false)}
                    className="flex-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {groups.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No groups yet. Create one to get started!
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  className={`p-3 border-b border-gray-200 cursor-pointer transition ${
                    activeGroupId === group.id
                      ? 'bg-indigo-100 border-l-4 border-l-indigo-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <Hash size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{group.name}</div>
                      <div className="text-xs text-gray-500 truncate">by {group.createdBy}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Active Group Header */}
          {activeGroupId && (
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center">
                <Hash size={20} className="text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {groups.find(g => g.id === activeGroupId)?.name || 'Group Chat'}
                </h3>
              </div>
            </div>
          )}
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <MessageSquare size={48} className="mb-4 text-gray-300" />
                <p className="text-lg mb-2">No messages yet</p>
                <p className="text-center">Be the first to start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === userName ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.userId === userName
                          ? 'bg-indigo-500 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {message.userId !== userName && (
                        <div className="font-semibold text-sm mb-1 flex items-center">
                          <User size={12} className="mr-1" />
                          {message.userName}
                        </div>
                      )}
                      <div className="text-sm">{message.text}</div>
                      <div
                        className={`text-xs mt-1 flex items-center ${
                          message.userId === userName ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        <Clock size={10} className="mr-1" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  activeGroupId 
                    ? `Message ${groups.find(g => g.id === activeGroupId)?.name || 'group'}...` 
                    : 'Select a group to message'
                }
                disabled={!activeGroupId}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !activeGroupId}
                className={`bg-indigo-600 text-white px-4 py-2 rounded-r-full font-medium transition ${
                  newMessage.trim() && activeGroupId
                    ? 'hover:bg-indigo-700'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGroupChatV2;