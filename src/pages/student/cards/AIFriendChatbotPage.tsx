import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Smile, Plus, Paperclip, Mic } from 'lucide-react'

const AIFriendChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your AI learning companion. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      text: "I'm having trouble understanding neural networks. Can you explain them simply?",
      sender: 'user',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      text: "Of course! Neural networks are computing systems inspired by the human brain. They consist of layers of interconnected nodes (neurons) that process information. Each connection has a weight that adjusts as the network learns. The basic idea is to recognize patterns in data through training.\n\nThink of it like this: Just as our brain learns to recognize a cat by seeing many examples, a neural network learns to identify cats in images by analyzing thousands of cat photos during training.",
      sender: 'ai',
      timestamp: new Date(Date.now() - 180000)
    }
  ])
  
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputText.trim() === '') return

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newUserMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Let me explain that in a simple way.",
        "I understand your confusion. Here's how I would approach this topic...",
        "Interesting point! Based on what you've asked, here's what I think...",
        "Let me break this down for you step by step.",
        "I can definitely help with that. Here's what you need to know..."
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      const newAiMessage = {
        id: messages.length + 2,
        text: randomResponse + "\n\nThis is a simulated response. In a real implementation, this would connect to an AI service like Gemini or OpenAI to provide personalized learning assistance based on your specific questions and learning progress.",
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newAiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>
          <MessageCircle size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          AI Friend Chatbot
        </h1>
        <p>Your personal AI learning companion ready to help with any questions</p>
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
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={24} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>AI Learning Companion</h3>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem', 
              color: isTyping ? 'var(--success-500)' : 'var(--text-secondary)'
            }}>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
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
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '15px'
              }}
            >
              {message.sender === 'ai' && (
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={20} style={{ color: 'var(--primary-600)' }} />
                </div>
              )}
              
              <div style={{ 
                maxWidth: '70%',
                backgroundColor: message.sender === 'user' 
                  ? 'var(--primary-500)' 
                  : 'var(--bg-secondary)',
                color: message.sender === 'user' 
                  ? 'white' 
                  : 'var(--text-primary)',
                padding: '15px',
                borderRadius: message.sender === 'user' 
                  ? '18px 18px 4px 18px' 
                  : '18px 18px 18px 4px',
                border: message.sender === 'ai' 
                  ? '1px solid var(--border-primary)' 
                  : 'none'
              }}>
                <div style={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5
                }}>
                  {message.text}
                </div>
                <div style={{ 
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  color: message.sender === 'user' 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : 'var(--text-secondary)',
                  marginTop: '8px'
                }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {message.sender === 'user' && (
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--secondary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={20} style={{ color: 'var(--secondary-600)' }} />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '15px'
            }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={20} style={{ color: 'var(--primary-600)' }} />
              </div>
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)',
                padding: '15px',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid var(--border-primary)'
              }}>
                <div style={{ 
                  display: 'flex',
                  gap: '5px'
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--text-secondary)',
                    animation: 'typing 1.4s infinite ease-in-out'
                  }}></div>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--text-secondary)',
                    animation: 'typing 1.4s infinite ease-in-out 0.2s'
                  }}></div>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--text-secondary)',
                    animation: 'typing 1.4s infinite ease-in-out 0.4s'
                  }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div style={{ 
          padding: '20px',
          borderTop: '1px solid var(--border-primary)',
          display: 'flex',
          gap: '15px'
        }}>
          <button className="btn btn-outline" style={{ padding: '10px' }}>
            <Plus size={20} />
          </button>
          
          <div style={{ 
            flex: 1,
            position: 'relative'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your AI friend anything..."
              className="form-input"
              style={{ 
                width: '100%',
                paddingRight: '100px'
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
                <Paperclip size={18} />
              </button>
              <button className="btn btn-icon" style={{ padding: '5px' }}>
                <Mic size={18} />
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
      
      {/* Quick Prompts */}
      <div className="card fade-in-up" style={{ 
        animationDelay: '0.2s',
        marginTop: '20px'
      }}>
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Quick Questions</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {[
              "Explain photosynthesis simply",
              "Help me with algebra basics",
              "What's machine learning?",
              "History of ancient Rome"
            ].map((prompt, index) => (
              <button
                key={index}
                className="btn btn-outline"
                onClick={() => setInputText(prompt)}
                style={{ 
                  padding: '15px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Smile size={18} />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIFriendChatbotPage