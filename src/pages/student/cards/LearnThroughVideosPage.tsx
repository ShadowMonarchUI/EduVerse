import React, { useState } from 'react'
import { Play, Search, Clock, User, Heart, Filter } from 'lucide-react'

const LearnThroughVideosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock video data
  const videos = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      duration: '15:30',
      views: '1.2K',
      author: 'AI Learning Hub',
      thumbnail: 'https://placehold.co/320x180/6366f1/white?text=ML+Intro'
    },
    {
      id: 2,
      title: 'Deep Learning Fundamentals',
      duration: '22:15',
      views: '800',
      author: 'Neural Networks Pro',
      thumbnail: 'https://placehold.co/320x180/8b5cf6/white?text=DL+Fund'
    },
    {
      id: 3,
      title: 'Natural Language Processing',
      duration: '18:45',
      views: '2.1K',
      author: 'Language AI',
      thumbnail: 'https://placehold.co/320x180/ec4899/white?text=NLP'
    },
    {
      id: 4,
      title: 'Computer Vision Basics',
      duration: '25:10',
      views: '1.5K',
      author: 'Vision Tech',
      thumbnail: 'https://placehold.co/320x180/10b981/white?text=CV'
    },
    {
      id: 5,
      title: 'Reinforcement Learning',
      duration: '30:20',
      views: '900',
      author: 'RL Academy',
      thumbnail: 'https://placehold.co/320x180/f59e0b/white?text=RL'
    },
    {
      id: 6,
      title: 'AI Ethics and Bias',
      duration: '12:45',
      views: '3.2K',
      author: 'Ethical AI',
      thumbnail: 'https://placehold.co/320x180/ef4444/white?text=Ethics'
    }
  ]

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>
          <Play size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Learn Through Videos
        </h1>
        <p>Discover educational videos tailored to your learning path</p>
      </div>
      
      {/* Search and Filters */}
      <div className="card fade-in-up" style={{ animationDelay: '0.1s', marginBottom: '30px' }}>
        <div style={{ padding: '25px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px'
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for videos..."
                className="form-input form-input-lg"
                style={{ 
                  paddingLeft: '45px',
                  width: '100%'
                }}
              />
            </div>
            <button className="btn btn-secondary" style={{ padding: '12px 20px' }}>
              <Filter size={20} style={{ marginRight: '8px' }} />
              Filters
            </button>
          </div>
          
          <div style={{ 
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <button className="btn btn-outline">All Subjects</button>
            <button className="btn btn-outline">Math</button>
            <button className="btn btn-outline">Science</button>
            <button className="btn btn-outline">Technology</button>
            <button className="btn btn-outline">History</button>
          </div>
        </div>
      </div>
      
      {/* Video Grid */}
      <div className="card fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div style={{ padding: '25px' }}>
          <h2 style={{ marginTop: 0 }}>Recommended Videos</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="card modern"
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid var(--border-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ 
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  marginBottom: '15px'
                }}>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={{ 
                      width: '100%', 
                      height: '180px', 
                      objectFit: 'cover'
                    }}
                  />
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
                    <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {video.duration}
                  </div>
                </div>
                
                <h3 style={{ 
                  margin: '0 0 10px 0',
                  fontSize: '1.1rem',
                  lineHeight: 1.4
                }}>
                  {video.title}
                </h3>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <User size={14} style={{ marginRight: '5px' }} />
                    {video.author}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Heart size={14} style={{ marginRight: '5px' }} />
                    {video.views}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearnThroughVideosPage