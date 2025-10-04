import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, BookOpen, Lightbulb, Zap, Sparkles, Brain, Volume2, Mic, Paperclip } from 'lucide-react'

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI learning assistant. How can I help you with your studies today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      text: "I'm having trouble understanding fractions. Can you explain them to me?",
      sender: 'user',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      text: "Of course! Fractions represent parts of a whole. Think of them like slices of a pizza. If you have a pizza cut into 8 equal slices and you eat 3, you've eaten 3/8 of the pizza. The bottom number (denominator) tells you how many equal parts the whole is divided into, and the top number (numerator) tells you how many parts you have.",
      sender: 'ai',
      timestamp: new Date(Date.now() - 180000)
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        "That's a great question! Let me explain that concept in a different way.",
        "I understand your confusion. Here's another way to think about it...",
        "Excellent point! Many students struggle with this. Let's break it down step by step.",
        "Interesting perspective! Here's how that applies to what we're learning...",
        "Good question! Let's explore that together.",
        "I see what you're asking. Here's a helpful analogy..."
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      const newAiMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newAiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Quick actions for common questions
  const quickActions = [
    { 
      icon: <BookOpen size={20} />, 
      text: "Explain fractions", 
      prompt: "Can you explain fractions in a simple way?" 
    },
    { 
      icon: <Lightbulb size={20} />, 
      text: "Study tips", 
      prompt: "What are some effective study tips for math?" 
    },
    { 
      icon: <Zap size={20} />, 
      text: "Practice problems", 
      prompt: "Can you give me some practice problems for addition?" 
    },
    { 
      icon: <Sparkles size={20} />, 
      text: "Learning path", 
      prompt: "What should I learn next after mastering addition?" 
    }
  ]

  const handleQuickAction = (prompt: string) => {
    setInputText(prompt)
  }

  return (
    <div className="container" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="header fade-in-up">
        <h1>AI Learning Assistant</h1>
        <p>Your personalized tutor powered by artificial intelligence</p>
      </div>

      {/* Chat Container */}
      <div className="card fade-in-up" style={{ 
        animationDelay: '0.4s', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%'
      }}>
        <div className="card-header">
          <h2 className="card-title">Chat with AI Tutor</h2>
          <p className="card-subtitle">Ask questions, get explanations, and receive personalized learning assistance</p>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '25px',
          padding: '20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)'
        }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickAction(action.prompt)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '12px 20px',
                fontSize: '0.95rem'
              }}
            >
              {action.icon}
              {action.text}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              style={{ 
                display: 'flex', 
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '20px',
                animation: 'fadeInUp 0.3s ease'
              }}
            >
              <div style={{ 
                maxWidth: '80%', 
                display: 'flex',
                gap: '15px'
              }}>
                {message.sender === 'ai' && (
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <Bot size={20} />
                  </div>
                )}
                
                <div style={{ 
                  backgroundColor: message.sender === 'user' ? 'var(--primary-600)' : 'var(--bg-card)',
                  color: message.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '18px',
                  borderRadius: '18px',
                  boxShadow: 'var(--shadow-sm)',
                  border: message.sender === 'ai' ? '1px solid var(--border-primary)' : 'none'
                }}>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{message.text}</p>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    marginTop: '10px', 
                    opacity: 0.8,
                    textAlign: message.sender === 'user' ? 'right' : 'left'
                  }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--neutral-300)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    flexShrink: 0
                  }}>
                    <User size={20} />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-start',
              marginBottom: '20px',
              animation: 'fadeInUp 0.3s ease'
            }}>
              <div style={{ 
                display: 'flex',
                gap: '15px'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0
                }}>
                  <Bot size={20} />
                </div>
                
                <div style={{ 
                  backgroundColor: 'var(--bg-card)',
                  padding: '18px',
                  borderRadius: '18px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          alignItems: 'flex-end'
        }}>
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '10px',
              alignItems: 'center'
            }}>
              <button className="btn btn-secondary btn-icon" title="Attach file">
                <Paperclip size={20} />
              </button>
              <button className="btn btn-secondary btn-icon" title="Voice input">
                <Mic size={20} />
              </button>
            </div>
            
            <div style={{ 
              position: 'relative',
              flex: 1
            }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your AI tutor anything about your studies..."
                style={{
                  width: '100%',
                  padding: '18px 60px 18px 20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  resize: 'none',
                  minHeight: '80px',
                  maxHeight: '150px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  boxShadow: 'var(--shadow-sm)'
                }}
                rows={2}
              />
              <button 
                className="btn btn-secondary btn-icon"
                onClick={() => {}}
                style={{
                  position: 'absolute',
                  right: '15px',
                  bottom: '15px',
                  width: '40px',
                  height: '40px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Text to speech"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleSend}
            disabled={inputText.trim() === '' || isTyping}
            style={{ 
              height: '80px',
              width: '80px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AITutor