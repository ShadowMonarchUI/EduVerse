import React, { useState, useEffect, useRef } from 'react'
import { Brain, Video, Play, Bot, MessageSquare, FileQuestion, BookOpen, Target, Zap, Award, Search, Loader, Users, Heart, MessageCircle, Share, Volume2, VolumeX, Pause } from 'lucide-react'
import HumeChatbot from '../components/HumeChatbot'
import type { HumeChatbotHandles } from '../components/HumeChatbot'
import GroupChat from '../components/GroupChat'
import SimpleGroupChatV2 from '../components/SimpleGroupChatV2'
import EduVerseMemeChat from '../components/EduVerseMemeChat'
import SimpleGroupChatFixed from '../components/SimpleGroupChatFixed'
import PublicGroupChat from '../components/PublicGroupChat'
import FirebaseChat from '../components/FirebaseChat'
import EduVerseFirebaseChat from '../components/EduVerseFirebaseChat'
import ThemedFirebaseChat from '../components/ThemedFirebaseChat'
import EduGroupChat from '../components/EduGroupChat'
import SmartQuizGenerator from '../components/SmartQuizGenerator'
import { useUser } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { explainConcept } from '../services/geminiService'
import { fetchPopularVideos, fetchShortEducationalVideos, fetchVideoById } from '../services/youtubeService'
import VideoProgressTracker from '../components/VideoProgressTracker'
import VideoHistory from '../components/VideoHistory'

// Declare Taggbox global variable
declare global {
  interface Window {
    Taggbox: any;
  }
}

const Dashboard: React.FC = () => {
  const { user, addExperience } = useUser()
  const navigate = useNavigate()
  const [concept, setConcept] = useState('')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeCard, setActiveCard] = useState<number | null>(null)

  // States for the Learn Through Videos card
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  // Add progress tracking state
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoCompleted, setVideoCompleted] = useState(false)
  // Add video history state
  const [showVideoHistory, setShowVideoHistory] = useState(false)

  // States for the Learn Through Reels card
  const [reels, setReels] = useState<any[]>([])
  const [reelsLoading, setReelsLoading] = useState(false)
  const [reelsError, setReelsError] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const reelContainerRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  
  // Reference for HumeChatbot to auto-start voice chat
  const humeChatbotRef = useRef<HumeChatbotHandles>(null)
  
  // Load Taggbox script when Social Learning Reels card is active
  useEffect(() => {
    if (activeCard === 2) {
      // Dynamically load the Taggbox script
      const script = document.createElement('script');
      script.src = 'https://widget.taggbox.com/embed.min.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);

      // Clean up the script when component unmounts
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [activeCard]);

  // Auto-start voice chat when entering the AI Friend Chatbot card
  useEffect(() => {
    if (activeCard === 3) {
      // Give the component a moment to mount
      setTimeout(() => {
        if (humeChatbotRef.current) {
          humeChatbotRef.current.startVoiceChat();
        }
      }, 1000);
    }
  }, [activeCard]);

  // Quick actions (exactly 6 cards as requested)
  const quickActions = [
    {
      title: 'Learn Anything',
      description: 'AI-powered concept explanations',
      icon: Brain,
      color: 'var(--primary-600)',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      action: () => setActiveCard(0)
    },
    {
      title: 'Learn Through Videos',
      description: 'Educational video content',
      icon: Video,
      color: 'var(--secondary-600)',
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      action: () => setActiveCard(1)
    },
    {
      title: 'Social Learning Reels',
      description: 'Community educational content',
      icon: Users,
      color: 'var(--success-500)',
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      action: () => setActiveCard(2)
    },
    {
      title: 'AI Friend Chatbot',
      description: 'Personal AI learning companion',
      icon: Bot,
      color: 'var(--info-500)',
      gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
      action: () => setActiveCard(3)
    },
    {
      title: 'Group Chat',
      description: 'Collaborate with peers',
      icon: MessageSquare,
      color: 'var(--warning-500)',
       gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
      action: () => setActiveCard(4)
    },
    {
      title: 'Smart Quiz Generator',
      description: 'AI quizzes from topics or PDFs',
      icon: Target,
      color: 'var(--accent-500)',
      gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      action: () => setActiveCard(5)
    }
  ]

  // Fetch videos when search term changes (for the Learn Through Videos card)
  useEffect(() => {
    // Only fetch when we're on the videos card
    if (activeCard !== 1) return;

    const fetchVideos = async () => {
      if (searchTerm.trim() === '') {
        setVideos([])
        return
      }
      
      try {
        setVideoLoading(true)
        setVideoError(null)
        // Fetch top videos by view count for the search term
        const videoData = await fetchPopularVideos(searchTerm, 12)
        setVideos(videoData)
      } catch (err) {
        setVideoError('Failed to fetch videos. Please try again.')
        console.error('Error fetching videos:', err)
      } finally {
        setVideoLoading(false)
      }
    }
    
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchVideos()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchTerm, activeCard])

  // Fetch reels when card is activated (for the Social Learning Reels card)
  useEffect(() => {
    if (activeCard !== 2) return;

    const fetchReels = async () => {
      try {
        setReelsLoading(true)
        setReelsError(null)
        // Fetch short educational videos (reels) - use broader search terms
        const reelData = await fetchShortEducationalVideos('education learning', 12)
        setReels(reelData)
      } catch (err) {
        setReelsError('Failed to fetch educational reels. Please try again.')
        console.error('Error fetching reels:', err)
      } finally {
        setReelsLoading(false)
      }
    }
    
    fetchReels()
  }, [activeCard])

  // Scroll functionality for reels (no longer needed with Taggbox)

  const handleLearn = async () => {
    if (!concept.trim()) {
      setError('Please enter a concept to learn about')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setExplanation('')
      
      // Get explanation based on difficulty
      const explanationText = await explainConcept(concept, difficulty)
      setExplanation(explanationText)
      
      // Award experience points for learning
      if (addExperience) {
        addExperience(20); // 20 XP for learning a concept
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get explanation. Please try again.'
      setError(errorMessage)
      setExplanation('')
      console.error('Error getting explanation:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && concept.trim()) {
      handleLearn()
    }
  }

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Beginner'
      case 'intermediate': return 'Intermediate'
      case 'advanced': return 'Advanced'
      default: return level
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'var(--success-500)'
      case 'intermediate': return 'var(--warning-500)'
      case 'advanced': return 'var(--error-500)'
      default: return 'var(--primary-500)'
    }
  }

  // Add function to handle video progress updates
  const handleVideoProgressUpdate = (progress: number) => {
    setVideoProgress(progress);
  };

  // Add function to handle video completion
  const handleVideoCompletion = () => {
    setVideoCompleted(true);
    // Award experience points for completing a video
    if (addExperience) {
      addExperience(30); // 30 XP for completing a video
    }
  };
  
  // Add function to handle video selection from history
  const handleVideoFromHistory = async (video: any) => {
    // If this is a full video object from search, use it directly
    if (video.description && video.views) {
      setSelectedVideo(video);
      setShowVideoHistory(false);
      return;
    }
    
    // Otherwise, fetch full video details
    try {
      setVideoLoading(true);
      const fullVideo = await fetchVideoById(video.id);
      
      if (fullVideo) {
        // Merge history data with full video data
        setSelectedVideo({
          ...fullVideo,
          progress: video.progress,
          lastPosition: video.lastPosition
        });
      } else {
        // If we can't fetch details, use the history data
        setSelectedVideo(video);
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
      // Fallback to history data
      setSelectedVideo(video);
    } finally {
      setVideoLoading(false);
      setShowVideoHistory(false);
    }
  };

  // Update the resetActiveCard function
  const resetActiveCard = () => {
    setActiveCard(null)
    // Reset video card states when leaving the card
    if (activeCard === 1) {
      setSearchTerm('')
      setSelectedVideo(null)
      setVideos([])
      setVideoError(null)
      setVideoProgress(0)
      setVideoCompleted(false)
      setShowVideoHistory(false);
    }
    // Reset learn anything card states
    if (activeCard === 0) {
      setConcept('')
      setExplanation('')
      setError(null)
    }
    // Reset social learning reels card states
    if (activeCard === 2) {
      // No specific cleanup needed for Taggbox
    }
    // Reset AI friend chatbot card states
    if (activeCard === 3) {
      // No specific cleanup needed
    }
    // Reset group chat card states
    if (activeCard === 4) {
      // No specific cleanup needed
    }
    // Reset mock test card states
    if (activeCard === 5) {
      // No specific cleanup needed
    }
  }

  // Scroll reels function (no longer needed with Taggbox)

  // Render content for each card based on activeCard state
  const renderCardContent = () => {
    switch (activeCard) {
      case 0: // Learn Anything
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <Brain size={28} style={{ color: 'var(--primary-600)' }} />
                  Learn Anything
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  Get AI-powered explanations for any concept in 3 difficulty levels
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            <div style={{ padding: '0 20px 20px 20px' }}>
              {/* Search Input */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '25px'
              }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={20} style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }} />
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a concept you want to learn about..."
                    className="form-input form-input-lg"
                    style={{ 
                      paddingLeft: '45px',
                      width: '100%'
                    }}
                  />
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleLearn}
                  disabled={loading || !concept.trim()}
                  style={{ padding: '12px 25px' }}
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="loading-spinner" style={{ marginRight: '8px' }} />
                      Learning...
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} style={{ marginRight: '8px' }} />
                      Learn
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="login-error" style={{ marginBottom: '20px' }}>
                  {error}
                </div>
              )}
              
              {/* Difficulty Selector */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '25px'
              }}>
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <button
                    key={level}
                    className={`btn ${difficulty === level ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDifficulty(level)}
                    style={{ 
                      flex: 1,
                      padding: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: `${getDifficultyColor(level)}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {level === 'beginner' && <Target size={20} style={{ color: getDifficultyColor(level) }} />}
                      {level === 'intermediate' && <Zap size={20} style={{ color: getDifficultyColor(level) }} />}
                      {level === 'advanced' && <Award size={20} style={{ color: getDifficultyColor(level) }} />}
                    </div>
                    <span>{getDifficultyLabel(level)}</span>
                  </button>
                ))}
              </div>
              
              {/* Explanation */}
              {explanation && (
                <div className="card" style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  padding: '20px'
                }}>
                  <div style={{ 
                    padding: '0 0 15px 0',
                    borderBottom: '1px solid var(--border-primary)',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{ 
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <Brain size={20} style={{ color: getDifficultyColor(difficulty) }} />
                      Explanation ({getDifficultyLabel(difficulty)} Level)
                    </h3>
                  </div>
                  <div style={{ 
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {explanation}
                  </div>
                </div>
              )}
              
              {!explanation && !loading && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: 'var(--text-secondary)'
                }}>
                  <Brain size={48} style={{ 
                    margin: '0 auto 20px', 
                    color: 'var(--primary-300)' 
                  }} />
                  <h3>Learn Any Concept</h3>
                  <p>Enter a topic above and choose your difficulty level to get an AI-powered explanation</p>
                </div>
              )}
            </div>
          </div>
        );
      case 1: // Learn Through Videos
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <Video size={28} style={{ color: 'var(--secondary-600)' }} />
                  Learn Through Videos
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  Top educational videos for your search topic
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            {selectedVideo ? (
              // Show selected video
              <div>
                {/* Embedded YouTube Player */}
                <div style={{ 
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  height: 0,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  marginBottom: '15px'
                }}>
                  <iframe
                    id={`youtube-player-${selectedVideo.id}`}
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?enablejsapi=1`}
                    title={selectedVideo.title}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 10px 0',
                      fontSize: '1.4rem'
                    }}>
                      {selectedVideo.title}
                    </h3>
                    <div style={{ 
                      display: 'flex',
                      gap: '15px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>
                      <span>{selectedVideo.views}</span>
                      <span>{selectedVideo.channel}</span>
                      <span>{selectedVideo.duration}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setSelectedVideo(null)}
                    style={{ padding: '8px 16px' }}
                  >
                    Back to Videos
                  </button>
                </div>
                
                <p style={{ 
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6
                }}>
                  {selectedVideo.description}
                </p>
                
                {/* Progress Tracking Section */}
                <VideoProgressTracker 
                  videoId={selectedVideo.id}
                  videoDuration={selectedVideo.duration}
                  videoTitle={selectedVideo.title}
                  videoThumbnail={selectedVideo.thumbnail}
                  videoChannel={selectedVideo.channel}
                  onProgressUpdate={handleVideoProgressUpdate}
                  onCompletion={handleVideoCompletion}
                />
              </div>
            ) : (
              // Show either search or history view
              <>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '25px'
                }}>
                  <h3 style={{ 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <Video size={20} style={{ color: 'var(--secondary-600)' }} />
                    {showVideoHistory ? 'Your Video History' : 'Search for Videos'}
                  </h3>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowVideoHistory(!showVideoHistory)}
                    style={{ padding: '8px 16px' }}
                  >
                    {showVideoHistory ? 'Search Videos' : 'View History'}
                  </button>
                </div>
                
                {showVideoHistory ? (
                  // Show video history
                  <VideoHistory onVideoSelect={handleVideoFromHistory} />
                ) : (
                  // Show search and video recommendations
                  <>
                    {/* Search Bar */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      marginBottom: '25px'
                    }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={20} style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: 'var(--text-secondary)'
                        }} />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search for educational videos..."
                          className="form-input form-input-lg"
                          style={{ 
                            paddingLeft: '45px',
                            width: '100%'
                          }}
                        />
                      </div>
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '12px 25px' }}
                        onClick={() => {
                          // Trigger search immediately
                          const fetchVideos = async () => {
                            if (searchTerm.trim() === '') {
                              setVideos([])
                              return
                            }
                            
                            try {
                              setVideoLoading(true)
                              setVideoError(null)
                              // Fetch top videos by view count for the search term
                              const videoData = await fetchPopularVideos(searchTerm, 12)
                              setVideos(videoData)
                            } catch (err) {
                              setVideoError('Failed to fetch videos. Please try again.')
                              console.error('Error fetching videos:', err)
                            } finally {
                              setVideoLoading(false)
                            }
                          }
                          
                          fetchVideos()
                        }}
                      >
                        <Search size={20} style={{ marginRight: '8px' }} />
                        Search
                      </button>
                    </div>
                    
                    {/* Loading indicator */}
                    {videoLoading && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '40px 20px'
                      }}>
                        <Loader size={32} className="loading-spinner" style={{ 
                          margin: '0 auto 20px', 
                          color: 'var(--primary-500)' 
                        }} />
                        <p>Loading top videos...</p>
                      </div>
                    )}
                    
                    {/* Error message */}
                    {videoError && (
                      <div className="login-error" style={{ marginBottom: '20px' }}>
                        {videoError}
                      </div>
                    )}
                    
                    {/* Video Recommendations */}
                    <div>
                      <h3 style={{ 
                        margin: '0 0 20px 0',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <Video size={20} style={{ color: 'var(--secondary-600)' }} />
                        Top Videos
                      </h3>
                      
                      {videos.length > 0 ? (
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                          gap: '20px'
                        }}>
                          {videos.map((video) => (
                            <div 
                              key={video.id}
                              className="card"
                              style={{ 
                                border: '1px solid var(--border-primary)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: 'var(--bg-secondary)'
                              }}
                              onClick={() => setSelectedVideo(video)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                              }}
                            >
                              <div style={{ 
                                position: 'relative',
                                height: '160px',
                                backgroundImage: `url(${video.thumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}>
                                <div style={{ 
                                  position: 'absolute',
                                  bottom: '10px',
                                  right: '10px',
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  color: 'white',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.8rem'
                                }}>
                                  {video.duration}
                                </div>
                              </div>
                              
                              <div style={{ padding: '15px' }}>
                                <h4 style={{ 
                                  margin: '0 0 10px 0',
                                  fontSize: '1.1rem',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {video.title}
                                </h4>
                                
                                <div style={{ 
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  color: 'var(--text-secondary)',
                                  fontSize: '0.9rem',
                                  marginBottom: '10px'
                                }}>
                                  <span>{video.channel}</span>
                                  <span>{video.views}</span>
                                </div>
                                
                                {/* Education indicator */}
                                <div style={{ 
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '2px 8px',
                                  backgroundColor: 'var(--success-100)',
                                  color: 'var(--success-700)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.8rem',
                                  fontWeight: 500
                                }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                                  </svg>
                                  Educational
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : !videoLoading && searchTerm ? (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '40px 20px',
                          color: 'var(--text-secondary)'
                        }}>
                          <Video size={48} style={{ 
                            margin: '0 auto 20px', 
                            color: 'var(--secondary-300)' 
                          }} />
                          <h3>No Relevant Educational Videos Found</h3>
                          <p>We couldn't find any educational videos that closely match your search for "{searchTerm}".</p>
                          <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                            Try using different keywords or check for typos. We only show high-quality educational explanation videos.
                          </p>
                        </div>
                      ) : !videoLoading ? (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '40px 20px',
                          color: 'var(--text-secondary)'
                        }}>
                          <Video size={48} style={{ 
                            margin: '0 auto 20px', 
                            color: 'var(--secondary-300)' 
                          }} />
                          <h3>Search for Educational Videos</h3>
                          <p>Enter a topic above to find high-quality educational explanation videos.</p>
                          <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                            We filter results to show only relevant educational content with detailed explanations.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );
      case 2: // Social Learning Reels
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <Users size={28} style={{ color: 'var(--success-500)' }} />
                  Social Learning Reels
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  Discover educational content from our learning community
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            {/* Taggbox Widget Container - Using specified dimensions */}
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '600px',
              backgroundColor: '#000',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div 
                className="taggbox" 
                style={{
                  width: '40%',
                  height: '80%',
                  overflow: 'auto'
                }} 
                data-widget-id="302824" 
                data-website="1" 
                data-tags="false" 
                data-keywords=""
              ></div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              <p>Swipe through educational videos from our learning community. Tap the volume icon to unmute.</p>
            </div>
          </div>
        );
      case 3: // AI Friend Chatbot
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <Bot size={28} style={{ color: 'var(--info-500)' }} />
                  AI Friend Chatbot (Sakha)
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  Personal AI learning companion for 24/7 assistance
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            <div style={{ flex: 1, minHeight: 0 }}>
              <HumeChatbot ref={humeChatbotRef} />
            </div>
          </div>
        );
      case 4: // Group Chat
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <MessageSquare size={28} style={{ color: 'var(--warning-500)' }} />
                  EduVerse Groups
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  Collaborate and learn with your peers in subject-specific study groups
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            <div style={{ flex: 1, minHeight: 0 }}>
              <EduGroupChat />
            </div>
          </div>
        );
      case 5: // Smart Quiz Generator (replacing Mock Test)
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <Target size={28} style={{ color: 'var(--accent-500)' }} />
                  Smart Quiz Generator
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  AI-powered quizzes from any topic or PDF content
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            <div style={{ flex: 1, minHeight: 0 }}>
              <SmartQuizGenerator />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Welcome Header with enhanced styling */}
      <div className="header fade-in-up" style={{ 
        textAlign: 'center',
        marginBottom: '40px',
        padding: '30px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
        border: '1px solid var(--border-primary)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 800,
          margin: '0 0 15px 0',
          background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))',
          WebkitBackgroundClip: 'text' as any,
          WebkitTextFillColor: 'transparent' as any,
          backgroundClip: 'text' as any
        }}>
          Welcome back, <span style={{ 
            background: 'linear-gradient(135deg, var(--primary-600), var(--success-600))',
            WebkitBackgroundClip: 'text' as any,
            WebkitTextFillColor: 'transparent' as any,
            backgroundClip: 'text' as any
          }}>{user?.name || 'Learner'}!</span>
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Ready to continue your learning journey? Let's make progress today!
        </p>
      </div>

      {/* Show only the active card content or the grid of cards */}
      {activeCard !== null ? (
        // Show only the active card content
        renderCardContent()
      ) : (
        // Main Dashboard Grid - Only show if no card is active
        <div className="actions-grid modern" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          marginTop: '20px'
        }}>
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div 
                key={index}
                className="action-card modern fade-in-up" 
                style={{ 
                  animationDelay: `${(index + 1) * 0.1}s`, 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '30px',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--bg-primary)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(0)'
                }}
                onClick={action.action}
                onMouseEnter={(e) => {
                  // Enhanced hover effects
                  e.currentTarget.style.transform = 'translateY(-10px)'
                  e.currentTarget.style.boxShadow = `0 20px 30px rgba(0, 0, 0, 0.15), 0 0 30px ${action.color}20`
                  
                  // Gradient border effect
                  e.currentTarget.style.borderImage = `${action.gradient} 1`
                  
                  // Icon animation
                  const icon = e.currentTarget.querySelector('.action-icon') as HTMLElement
                  if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)'
                    icon.style.background = action.gradient
                    icon.style.color = 'white'
                  }
                  
                  // Title color change
                  const title = e.currentTarget.querySelector('h3') as HTMLElement
                  if (title) {
                    title.style.background = action.gradient
                    ;(title.style as any).WebkitBackgroundClip = 'text'
                    ;(title.style as any).WebkitTextFillColor = 'transparent'
                    title.style.backgroundClip = 'text'
                  }
                }}
                onMouseLeave={(e) => {
                  // Reset effects
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.borderImage = 'none'
                  e.currentTarget.style.borderColor = 'var(--border-primary)'
                  
                  // Reset icon
                  const icon = e.currentTarget.querySelector('.action-icon') as HTMLElement
                  if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)'
                    icon.style.background = `${action.color}15`
                    icon.style.color = action.color
                  }
                  
                  // Reset title
                  const title = e.currentTarget.querySelector('h3') as HTMLElement
                  if (title) {
                    title.style.background = 'none'
                    title.style.color = 'var(--text-primary)'
                    ;(title.style as any).WebkitBackgroundClip = 'initial'
                    ;(title.style as any).WebkitTextFillColor = 'initial'
                    title.style.backgroundClip = 'initial'
                  }
                }}
              >
                {/* Decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: `${action.color}05`,
                  borderRadius: '50%',
                  zIndex: 0
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '100px',
                  height: '100px',
                  background: `${action.color}03`,
                  borderRadius: '50%',
                  zIndex: 0
                }}></div>
                
                {/* Icon with enhanced styling */}
                <div className="action-icon" style={{ 
                  color: action.color,
                  marginBottom: '25px',
                  backgroundColor: `${action.color}15`,
                  width: '70px',
                  height: '70px',
                  borderRadius: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative',
                  zIndex: 1,
                  border: `2px solid ${action.color}20`
                }}>
                  <Icon size={36} />
                </div>
                
                <h3 style={{ 
                  margin: '0 0 15px 0',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {action.title}
                </h3>
                
                <p style={{ 
                  margin: 0,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {action.description}
                </p>
                
                {/* Animated bottom bar */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '20px',
                  width: '100%',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    height: '3px',
                    background: `${action.color}20`,
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: '0%',
                      background: action.gradient,
                      transition: 'width 0.5s ease',
                      borderRadius: 'var(--radius-full)'
                    }}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dashboard