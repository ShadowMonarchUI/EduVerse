import React, { useState, useEffect, useRef } from 'react';
import { Send, User, LogOut, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { database, ref, push, onValue, getAuth, signInAnonymously } from '../services/firebase';

interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

const ThemedFirebaseChat: React.FC = () => {
  // User state
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
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
          const savedName = localStorage.getItem('themedchat_name');
          if (savedName) {
            setName(savedName);
            setJoined(true);
          }
        } else {
          // Try to sign in anonymously
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
          
          // Check if user has already joined
          const savedName = localStorage.getItem('themedchat_name');
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
        const savedName = localStorage.getItem('themedchat_name');
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
    
    localStorage.setItem('themedchat_name', name.trim());
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
    localStorage.removeItem('themedchat_name');
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Initializing chat...</p>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4">
            <MessageCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            EduVerse Chat
          </h1>
          <p className="text-gray-600">Join the conversation with your peers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Join Form */}
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              onKeyUp={(e) => {
                if (name.trim() && e.key === 'Enter') {
                  handleJoin();
                }
              }}
            />
          </div>
          
          <button
            onClick={handleJoin}
            disabled={!name.trim()}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              name.trim()
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 text-white mr-3">
              <MessageCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">EduVerse Chat</h2>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-2 transition"
          >
            <LogOut size={16} className="mr-1" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 p-4 hidden md:block">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <User size={18} className="mr-2 text-blue-500" />
              Your Profile
            </h3>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{name}</div>
                  <div className="text-sm text-green-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Chat Info</h3>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Welcome to the EduVerse community chat!</p>
                <p>Connect with fellow learners and share knowledge.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <MessageCircle size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
                <p className="text-gray-500 max-w-md">
                  Be the first to start the conversation! Share your thoughts and connect with others.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex ${msg.senderId === (user?.uid || 'mock-user') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
                        msg.senderId === (user?.uid || 'mock-user')
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <span className={`font-semibold ${msg.senderId === (user?.uid || 'mock-user') ? 'text-white' : 'text-gray-900'}`}>
                          {msg.senderName}
                        </span>
                        {msg.senderId === (user?.uid || 'mock-user') && (
                          <span className="ml-2 text-blue-100 text-xs font-medium">(You)</span>
                        )}
                      </div>
                      <p className={`${msg.senderId === (user?.uid || 'mock-user') ? 'text-white' : 'text-gray-700'}`}>
                        {msg.text}
                      </p>
                      <div className={`text-xs mt-1 ${msg.senderId === (user?.uid || 'mock-user') ? 'text-blue-100' : 'text-gray-500'}`}>
                        <Clock size={12} className="inline mr-1" />
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={16} />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`ml-3 w-12 h-12 rounded-full flex items-center justify-center transition ${
                  newMessage.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemedFirebaseChat;