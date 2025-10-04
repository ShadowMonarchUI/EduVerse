import React, { useState, useRef, useEffect } from 'react'
import { Users, Send, MoreVertical, Smile, Paperclip, Mic, Image, Gift, Hash, Search } from 'lucide-react'

const GroupChatPage: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey everyone! How's your learning going?",
      sender: 'Alex Johnson',
      senderId: 'user1',
      timestamp: new Date(Date.now() - 3600000),
      avatar: 'https://placehold.co/40x40/6366f1/white?text=A'
    },
    {
      id: 2,
      text: "Pretty good! Just finished the neural networks module.",
      sender: 'Sam Wilson',
      senderId: 'user2',
      timestamp: new Date(Date.now() - 3500000),
      avatar: 'https://placehold.co/40x40/8b5cf6/white?text=S'
    },
    {
      id: 3,
      text: "That's awesome! I'm still on the basics. Any tips?",
      sender: 'You',
      senderId: 'currentUser',
      timestamp: new Date(Date.now() - 3400000),
      avatar: 'https://placehold.co/40x40/10b981/white?text=Y'
    },
    {
      id: 4,
      text: "Sure! The 3Blue1Brown YouTube series on neural networks is fantastic for visual learners.",
      sender: 'Taylor Kim',
      senderId: 'user3',
      timestamp: new Date(Date.now() - 3300000),
      avatar: 'https://placehold.co/40x40/ec4899/white?text=T'
    },
    {
      id: 5,
      text: "Thanks! I'll check that out.",
      sender: 'You',
      senderId: 'currentUser',
      timestamp: new Date(Date.now() - 3200000),
      avatar: 'https://placehold.co/40x40/10b981/white?text=Y'
    },
    {
      id: 6,
      text: "Also, I found this interactive neural network playground: https://playground.tensorflow.org/",
      sender: 'Jordan Smith',
      senderId: 'user4',
      timestamp: new Date(Date.now() - 3100000),
      avatar: 'https://placehold.co/40x40/f59e0b/white?text=J'
    },
    {
      id: 7,
      text: "Perfect! That's exactly what I needed.",
      sender: 'You',
      senderId: 'currentUser',
      timestamp: new Date(Date.now() - 3000000),
      avatar: 'https://placehold.co/40x40/10b981/white?text=Y'
    }
  ])
  
  const [inputText, setInputText] = useState('')
  const [onlineUsers] = useState([
    { id: 'user1', name: 'Alex Johnson', avatar: 'https://placehold.co/32x32/6366f1/white?text=A' },
    { id: 'user2', name: 'Sam Wilson', avatar: 'https://placehold.co/32x32/8b5cf6/white?text=S' },
    { id: 'user3', name: 'Taylor Kim', avatar: 'https://placehold.co/32x32/ec4899/white?text=T' },
    { id: 'user4', name: 'Jordan Smith', avatar: 'https://placehold.co/32x32/f59e0b/white?text=J' },
    { id: 'user5', name: 'Morgan Lee', avatar: 'https://placehold.co/32x32/ef4444/white?text=M' }
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputText.trim() === '') return

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'You',
      senderId: 'currentUser',
      timestamp: new Date(),
      avatar: 'https://placehold.co/40x40/10b981/white?text=Y'
    }
    
    setMessages(prev => [...prev, newMessage])
    setInputText('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>
          <Users size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Peer Learning Group Chat
        </h1>
        <p>Collaborate and learn with your fellow students</p>
      </div>
      
      <div className="card fade-in-up" style={{ 
        animationDelay: '0.1s',
        display: 'flex',
        flexDirection: 'column',
        height: '70vh',
        padding: 0
      }}>
        {/* Chat Header */}
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Hash size={24} style={{ color: 'var(--primary-600)' }} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Machine Learning Study Group</h3>
              <p style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)'
              }}>
                24 members, 5 online
              </p>
            </div>
          </div>
          
          <button className="btn btn-icon">
            <MoreVertical size={20} />
          </button>
        </div>
        
        {/* Online Users */}
        <div style={{ 
          padding: '15px 20px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span style={{ 
            fontSize: '0.9rem', 
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap'
          }}>
            Online:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {onlineUsers.slice(0, 4).map((user) => (
              <div 
                key={user.id}
                style={{ 
                  position: 'relative'
                }}
                title={user.name}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%'
                  }}
                />
                <div style={{ 
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'var(--success-500)',
                  border: '2px solid white',
                  borderRadius: '50%'
                }}></div>
              </div>
            ))}
            {onlineUsers.length > 4 && (
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)'
              }}>
                +{onlineUsers.length - 4}
              </div>
            )}
          </div>
        </div>
        
        {/* Messages Container */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {messages.map((message) => (
            <div 
              key={message.id}
              style={{ 
                display: 'flex',
                gap: '15px'
              }}
            >
              <img 
                src={message.avatar} 
                alt={message.sender}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  flexShrink: 0
                }}
              />
              
              <div style={{ 
                flex: 1
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '5px'
                }}>
                  <span style={{ 
                    fontWeight: message.senderId === 'currentUser' ? 'bold' : 'normal',
                    color: message.senderId === 'currentUser' ? 'var(--primary-600)' : 'var(--text-primary)'
                  }}>
                    {message.sender}
                  </span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--text-secondary)'
                  }}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                <div style={{ 
                  backgroundColor: message.senderId === 'currentUser' 
                    ? 'var(--primary-100)' 
                    : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  border: message.senderId === 'currentUser' 
                    ? '1px solid var(--primary-200)' 
                    : '1px solid var(--border-primary)',
                  maxWidth: '80%',
                  lineHeight: 1.5
                }}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div style={{ 
          padding: '20px',
          borderTop: '1px solid var(--border-primary)',
          display: 'flex',
          gap: '15px'
        }}>
          <div style={{ 
            flex: 1,
            position: 'relative'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message #machine-learning-study-group"
              className="form-input"
              style={{ 
                width: '100%',
                paddingRight: '150px'
              }}
            />
            <div style={{ 
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: '10px'
            }}>
              <button className="btn btn-icon" style={{ padding: '5px' }}>
                <Gift size={18} />
              </button>
              <button className="btn btn-icon" style={{ padding: '5px' }}>
                <Image size={18} />
              </button>
              <button className="btn btn-icon" style={{ padding: '5px' }}>
                <Paperclip size={18} />
              </button>
            </div>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleSend}
            disabled={inputText.trim() === ''}
            style={{ 
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
      
      {/* Group Info */}
      <div className="card fade-in-up" style={{ 
        animationDelay: '0.2s',
        marginTop: '20px'
      }}>
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Study Group Information</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h4>Current Topic</h4>
              <p>Neural Networks and Deep Learning</p>
            </div>
            <div>
              <h4>Next Session</h4>
              <p>Tomorrow, 4:00 PM EST</p>
            </div>
            <div>
              <h4>Resources</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-outline btn-sm">
                  <Search size={16} style={{ marginRight: '5px' }} />
                  Find Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupChatPage