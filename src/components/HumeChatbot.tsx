import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { HumeClient } from 'hume';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  MessageCircle, 
  Send,
  Phone,
  PhoneOff,
  User,
  Sparkles,
  BookOpen,
  Heart,
  Smile,
  ThumbsUp,
  Lightbulb,
  GraduationCap,
  Sun,
  Moon,
  Coffee,
  Clock,
  Calendar,
  Book
} from 'lucide-react';

// Import Hume utilities for audio handling
import { 
  getAudioStream,
  convertBlobToBase64,
  getBrowserSupportedMimeType,
  MimeType,
  EVIWebAudioPlayer
} from 'hume';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the methods that can be called via ref
export interface HumeChatbotHandles {
  startVoiceChat: () => void;
}

const HumeChatbot = forwardRef<HumeChatbotHandles, {}>((props, ref) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationStage, setConversationStage] = useState<'greeting' | 'day_check' | 'topic' | 'learning' | 'review'>('greeting');
  
  const clientRef = useRef<HumeClient | null>(null);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    startVoiceChat: async () => {
      if (!isConnected) {
        await initializeClient();
      }
      if (!isInCall) {
        await startAudioCapture();
        setIsInCall(true);
      }
    }
  }));

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      stopAudioCapture();
    };
  }, []);

  // Get time-based greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get friendly greeting message
  const getGreetingMessage = () => {
    const greetings = [
      `${getTimeGreeting()}! I'm excited to learn with you today! 😊`,
      `Hello there! Ready to explore something new together?`,
      `Hi! I've been looking forward to our study session!`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Get follow-up questions based on conversation stage
  const getFollowUpQuestions = () => {
    switch (conversationStage) {
      case 'greeting':
        return [
          "How has your day been going so far?",
          "What are you most excited to learn about today?",
          "Is there anything specific you'd like to explore?"
        ];
      case 'day_check':
        return [
          "That sounds interesting! What would you like to learn about today?",
          "Is there a particular subject you're struggling with that I can help with?",
          "Would you prefer to review something you've learned recently or explore a new topic?"
        ];
      case 'topic':
        return [
          "That sounds interesting! Can you tell me more about what you'd like to know?",
          "What part of this topic are you finding most challenging?",
          "Would you like me to explain this in a simpler way with examples?"
        ];
      case 'learning':
        return [
          "Does that make sense so far? Feel free to ask me to explain anything again!",
          "What would you like to learn next about this topic?",
          "Is there a particular example you'd like me to help with?"
        ];
      case 'review':
        return [
          "Let's review what we've learned! What was the most interesting part?",
          "Do you have any questions about what we just discussed?",
          "Would you like to dive deeper into any of these concepts?"
        ];
      default:
        return [
          "What would you like to explore next?",
          "Is there anything else you'd like me to help with?",
          "What's on your mind today?"
        ];
    }
  };

  // Get educational context for responses
  const getEducationalContext = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for common educational topics
    if (lowerMessage.includes('math') || lowerMessage.includes('algebra') || lowerMessage.includes('calculus')) {
      return "I see you're interested in math! I can help explain concepts step by step with clear examples.";
    }
    if (lowerMessage.includes('science') || lowerMessage.includes('biology') || lowerMessage.includes('chemistry') || lowerMessage.includes('physics')) {
      return "Science is fascinating! I can break down complex scientific concepts into easy-to-understand explanations.";
    }
    if (lowerMessage.includes('history') || lowerMessage.includes('social studies')) {
      return "History helps us understand the world! I can help you remember important events and their significance.";
    }
    if (lowerMessage.includes('language') || lowerMessage.includes('english') || lowerMessage.includes('writing')) {
      return "Language skills are important! I can help with grammar, vocabulary, and writing techniques.";
    }
    if (lowerMessage.includes('programming') || lowerMessage.includes('code') || lowerMessage.includes('computer')) {
      return "Programming is a valuable skill! I can explain coding concepts with practical examples.";
    }
    
    return "I'm here to help you learn! Please tell me more about what you'd like to understand.";
  };

  // Get friendly educational response
  const getFriendlyEducationalResponse = (userMessage: string) => {
    const educationalContext = getEducationalContext(userMessage);
    const friendlyResponses = [
      `That's a great question! ${educationalContext} Let me explain it in a way that's easy to understand.`,
      `I'd be happy to help with that! ${educationalContext} Here's a clear explanation:`,
      `Excellent topic! ${educationalContext} Let me break this down for you:`,
      `Interesting! ${educationalContext} I'll make sure to explain this clearly with examples.`
    ];
    return friendlyResponses[Math.floor(Math.random() * friendlyResponses.length)];
  };

  // Initialize Hume client
  const initializeClient = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if API key is available
      const apiKey = import.meta.env.VITE_HUME_API_KEY;
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        throw new Error('Hume API key is missing. Please check your environment configuration.');
      }
      
      // Initialize the HumeClient
      const client = new HumeClient({
        apiKey: apiKey,
      });
      
      clientRef.current = client;
      
      // Connect to the WebSocket
      const socket = await client.empathicVoice.chat.connect({
        configId: undefined, // Use default config
      });
      
      // Set up event handlers
      socket.on('open', () => {
        console.log('WebSocket connection opened');
        setIsConnected(true);
        setIsLoading(false);
        
        // Send initial greeting after connection
        setTimeout(() => {
          const greetingMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `${getGreetingMessage()} I'm here to help make learning easy and fun. ${conversationStage === 'greeting' ? "How has your day been so far?" : "What would you like to explore today?"}`,
            timestamp: new Date(),
          };
          setMessages([greetingMessage]);
        }, 500);
      });
      
      socket.on('message', (message: any) => {
        console.log('Received message:', message);
        // Handle incoming messages
        switch (message.type) {
          case 'user_message':
            const userMessage: Message = {
              id: Date.now().toString(),
              role: 'user',
              content: message.message.content,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);
            
            // Update conversation stage based on user input
            if (conversationStage === 'greeting') {
              setConversationStage('day_check');
            } else if (conversationStage === 'day_check') {
              setConversationStage('topic');
            } else if (conversationStage === 'topic') {
              setConversationStage('learning');
            }
            break;
            
          case 'assistant_message':
            setIsThinking(false);
            const assistantMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: message.message.content,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            
            // Update conversation stage after assistant response
            if (conversationStage === 'learning') {
              setConversationStage('review');
            }
            break;
            
          case 'audio_output':
            // Handle audio output for playback
            if (audioPlayerRef.current) {
              audioPlayerRef.current.enqueue(message);
            }
            break;
            
          case 'user_interruption':
            // Stop audio playback when user interrupts
            if (audioPlayerRef.current) {
              audioPlayerRef.current.stop();
            }
            break;
        }
      });
      
      socket.on('error', (err: any) => {
        console.error('WebSocket error:', err);
        setError(`Connection error: ${err.message || 'Unknown error occurred. Please check your API key and network connection.'}`);
        setIsLoading(false);
        setIsInCall(false);
        setIsThinking(false);
      });
      
      socket.on('close', () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
        setIsInCall(false);
        setIsThinking(false);
        stopAudioCapture();
      });
      
      socketRef.current = socket;
      
      // Initialize audio player
      audioPlayerRef.current = new EVIWebAudioPlayer();
      await audioPlayerRef.current.init();
    } catch (err: any) {
      console.error('Error initializing client:', err);
      setError(`Failed to initialize chatbot: ${err.message || 'Please check your API key and try again.'}`);
      setIsLoading(false);
    }
  };

  // Start audio capture
  const startAudioCapture = async () => {
    if (!socketRef.current || !isConnected) {
      await initializeClient();
      return;
    }
    
    try {
      // Get supported MIME type
      const mimeTypeResult = getBrowserSupportedMimeType();
      const mimeType = mimeTypeResult.success 
        ? mimeTypeResult.mimeType 
        : MimeType.WEBM;
      
      // Get audio stream from microphone
      const stream = await getAudioStream();
      audioStreamRef.current = stream;
      
      // Validate stream has audio tracks
      if (stream.getAudioTracks().length === 0) {
        throw new Error('No audio tracks found in the stream');
      }
      
      // Create media recorder
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      
      // Set up data handler
      recorder.ondataavailable = async (e: BlobEvent) => {
        if (e.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
          try {
            const base64Data = await convertBlobToBase64(e.data);
            socketRef.current.sendAudioInput({ data: base64Data });
          } catch (err) {
            console.error('Error sending audio data:', err);
          }
        }
      };
      
      recorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        setError('Audio recording error occurred');
      };
      
      // Start recording with 100ms time slices for real-time streaming
      recorder.start(100);
      
      setIsListening(true);
      console.log('Audio capture started');
    } catch (err: any) {
      console.error('Error starting audio capture:', err);
      setError(`Microphone access error: ${err.message}`);
      setIsListening(false);
    }
  };

  // Stop audio capture
  const stopAudioCapture = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
      
      setIsListening(false);
      console.log('Audio capture stopped');
    } catch (err) {
      console.error('Error stopping audio capture:', err);
    }
  };

  // Toggle voice chat
  const toggleVoiceChat = async () => {
    if (isInCall) {
      // End call
      stopAudioCapture();
      setIsInCall(false);
    } else {
      // Start call
      await startAudioCapture();
      setIsInCall(true);
    }
  };

  // Send text message
  const sendTextMessage = async () => {
    if (!inputText.trim() || !socketRef.current || !isConnected) return;
    
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsThinking(true);
      
      // Send message to Hume
      await socketRef.current.sendUserInput(inputText);
    } catch (err: any) {
      console.error('Error sending text message:', err);
      setError('Failed to send message. Please try again.');
      setIsThinking(false);
    }
  };

  // Send suggested question
  const sendSuggestedQuestion = async (question: string) => {
    setInputText(question);
    // Trigger send after a brief delay to allow state update
    setTimeout(() => {
      const sendButton = document.querySelector('button[onClick*="sendTextMessage"]') as HTMLButtonElement;
      if (sendButton) {
        sendButton.click();
      }
    }, 100);
  };

  // Disconnect
  const disconnect = async () => {
    stopAudioCapture();
    
    if (socketRef.current) {
      try {
        await socketRef.current.close();
      } catch (err: any) {
        console.error('Error disconnecting:', err);
      }
    }
    
    // Dispose audio player
    if (audioPlayerRef.current) {
      audioPlayerRef.current.dispose();
      audioPlayerRef.current = null;
    }
    
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsInCall(false);
    setIsMuted(false);
    setIsThinking(false);
    setMessages([]);
    setConversationStage('greeting');
  };

  // Retry connection
  const retryConnection = async () => {
    setError(null);
    await initializeClient();
  };

  // Handle input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      maxHeight: '600px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--border-primary)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Chat Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--info-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            animation: 'pulseGlow 2s infinite'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, var(--primary-600), var(--info-500))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Sakha - Your AI Friend</h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: isConnected ? 'var(--success-500)' : 'var(--error-500)' 
              }}></div>
              <span>{isConnected ? 'Ready to help!' : 'Getting ready...'}</span>
            </div>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px'
        }}>
          {isConnected && (
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-500)',
              animation: 'pulse 1.5s infinite'
            }}></div>
          )}
          <button 
            className="btn btn-secondary"
            style={{ 
              padding: '6px 12px',
              fontSize: '0.85rem'
            }}
          >
            Back
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: 'var(--bg-primary)'
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
              backgroundColor: 'var(--info-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              animation: 'bounce 2s infinite'
            }}>
              <GraduationCap size={35} style={{ color: 'var(--info-500)' }} />
            </div>
            <h3 style={{ 
              marginBottom: '10px',
              fontSize: '1.4rem',
              color: 'var(--text-primary)'
            }}>Hi there! I'm Sakha 😊</h3>
            <p style={{ 
              maxWidth: '400px', 
              marginTop: '10px', 
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}>
              I'm your personal AI learning companion! Ask me anything about your studies, 
              and I'll explain it in a way that makes sense to you.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginTop: '25px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '15px',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.9rem',
                maxWidth: '200px',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <BookOpen size={20} style={{ 
                  marginBottom: '10px', 
                  color: 'var(--primary-500)',
                  display: 'block',
                  margin: '0 auto 10px'
                }} />
                <strong>Study Help</strong>
                <p style={{ fontSize: '0.85rem', margin: '8px 0 0 0' }}>
                  Get clear explanations on any topic
                </p>
              </div>
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '15px',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.9rem',
                maxWidth: '200px',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <Lightbulb size={20} style={{ 
                  marginBottom: '10px', 
                  color: 'var(--success-500)',
                  display: 'block',
                  margin: '0 auto 10px'
                }} />
                <strong>24/7 Support</strong>
                <p style={{ fontSize: '0.85rem', margin: '8px 0 0 0' }}>
                  Always here when you need help
                </p>
              </div>
            </div>
            
            <div style={{ 
              marginTop: '30px', 
              width: '100%',
              maxWidth: '500px'
            }}>
              <h4 style={{ 
                marginBottom: '15px',
                color: 'var(--text-primary)',
                fontSize: '1.1rem'
              }}>
                <Smile size={20} style={{ 
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  color: 'var(--warning-500)'
                }} />
                Let's get started:
              </h4>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {getFollowUpQuestions().map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendSuggestedQuestion(question)}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '16px',
                      padding: '12px 18px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                      e.currentTarget.style.borderColor = 'var(--primary-300)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {index === 0 && <Sun size={16} style={{ color: 'var(--warning-500)' }} />}
                    {index === 1 && <Coffee size={16} style={{ color: 'var(--primary-500)' }} />}
                    {index === 2 && <Moon size={16} style={{ color: 'var(--info-500)' }} />}
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '12px',
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              {message.role === 'assistant' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--info-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  animation: 'popIn 0.3s ease-out'
                }}>
                  <Sparkles size={18} style={{ color: 'var(--info-600)' }} />
                </div>
              )}
              <div style={{
                maxWidth: '85%',
                padding: '16px 20px',
                borderRadius: '20px',
                backgroundColor: message.role === 'user' 
                  ? 'var(--primary-500)' 
                  : 'var(--bg-secondary)',
                color: message.role === 'user' 
                  ? 'white' 
                  : 'var(--text-primary)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden',
                border: message.role === 'assistant' 
                  ? '1px solid var(--border-primary)' 
                  : 'none'
              }}>
                <div style={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                  fontSize: '1rem'
                }}>
                  {message.content}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  marginTop: '10px', 
                  opacity: 0.8,
                  textAlign: message.role === 'user' ? 'right' : 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {message.role === 'assistant' && (
                    <Heart size={12} style={{ color: 'var(--error-300)' }} />
                  )}
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.role === 'user' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  animation: 'popIn 0.3s ease-out'
                }}>
                  <User size={18} style={{ color: 'var(--primary-600)' }} />
                </div>
              )}
            </div>
          ))
        )}
        {isThinking && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '12px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--info-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <Sparkles size={18} style={{ color: 'var(--info-600)' }} />
            </div>
            <div style={{
              maxWidth: '85%',
              padding: '16px 20px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-secondary)',
                  animation: 'pulse 1.5s infinite'
                }}></div>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-secondary)',
                  animation: 'pulse 1.5s infinite 0.2s'
                }}></div>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-secondary)',
                  animation: 'pulse 1.5s infinite 0.4s'
                }}></div>
              </div>
              <span style={{ fontSize: '1rem' }}>Thinking... let me help you with that!</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '12px 20px', 
          backgroundColor: 'var(--error-100)', 
          color: 'var(--error-700)',
          fontSize: '0.9rem',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Oops!</strong> {error}
          </div>
          <button 
            onClick={retryConnection}
            className="btn btn-secondary"
            style={{ 
              padding: '4px 10px',
              fontSize: '0.8rem',
              backgroundColor: 'var(--error-700)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Controls */}
      <div style={{ 
        padding: '18px 20px',
        borderTop: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        {/* Input Area */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginBottom: '15px'
        }}>
          <div style={{ 
            flex: 1,
            position: 'relative'
          }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={conversationStage === 'greeting' || conversationStage === 'day_check'
                ? "Tell me about your day or what you'd like to learn..." 
                : "Ask me anything about your studies..."}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '28px',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                resize: 'none',
                minHeight: '56px',
                maxHeight: '120px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                transition: 'border-color 0.2s ease'
              }}
              disabled={!isConnected || isLoading}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-300)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
            />
          </div>
          <button
            onClick={sendTextMessage}
            disabled={!inputText.trim() || !isConnected || isLoading}
            style={{
              width: '56px',
              height: '56px',
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
            <Send size={22} />
          </button>
        </div>
        
        {/* Action Buttons - Voice Chat Button in the Middle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            {!isConnected ? (
              <button
                onClick={initializeClient}
                disabled={isLoading}
                className="btn btn-primary"
                style={{ 
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: '24px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                }}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner" style={{ width: '18px', height: '18px' }} />
                    Getting ready...
                  </>
                ) : (
                  <>
                    <ThumbsUp size={18} />
                    Start Learning
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={toggleVoiceChat}
                  className={`btn ${isInCall ? 'btn-warning' : 'btn-primary'}`}
                  style={{ 
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '24px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {isInCall ? (
                    <>
                      <PhoneOff size={18} />
                      End Voice Chat
                    </>
                  ) : (
                    <>
                      <Phone size={18} />
                      Voice Chat
                    </>
                  )}
                </button>
                <button
                  onClick={disconnect}
                  className="btn btn-secondary"
                  style={{ 
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    borderRadius: '20px',
                    marginLeft: '10px'
                  }}
                >
                  End Session
                </button>
              </>
            )}
          </div>
          {isConnected && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              {isListening && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--warning-100)',
                  borderRadius: '12px',
                  color: 'var(--warning-700)'
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--warning-500)' 
                  }}></div>
                  <span>Listening</span>
                </div>
              )}
              {isSpeaking && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--success-100)',
                  borderRadius: '12px',
                  color: 'var(--success-700)'
                }}>
                  <Volume2 size={14} />
                  <span>Speaking</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }
      `}</style>
    </div>
  );
});

export default HumeChatbot;
