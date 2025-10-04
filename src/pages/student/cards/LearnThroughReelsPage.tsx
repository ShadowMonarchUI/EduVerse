import React, { useState } from 'react'
import { Video, Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react'

const LearnThroughReelsPage: React.FC = () => {
  const [currentReel, setCurrentReel] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  
  // Mock reel data
  const reels = [
    {
      id: 1,
      title: '5 Math Tricks You Didn\'t Know',
      author: 'Math Wizard',
      likes: 12500,
      comments: 340,
      shares: 890,
      thumbnail: 'https://placehold.co/400x700/6366f1/white?text=Math+Tricks'
    },
    {
      id: 2,
      title: 'Science Experiments at Home',
      author: 'Science Explorer',
      likes: 8900,
      comments: 210,
      shares: 450,
      thumbnail: 'https://placehold.co/400x700/8b5cf6/white?text=Science'
    },
    {
      id: 3,
      title: 'History Facts in 60 Seconds',
      author: 'History Buff',
      likes: 15600,
      comments: 420,
      shares: 1200,
      thumbnail: 'https://placehold.co/400x700/ec4899/white?text=History'
    },
    {
      id: 4,
      title: 'Programming Tips for Beginners',
      author: 'Code Master',
      likes: 9800,
      comments: 180,
      shares: 320,
      thumbnail: 'https://placehold.co/400x700/10b981/white?text=Coding'
    }
  ]

  const nextReel = () => {
    setCurrentReel((prev) => (prev + 1) % reels.length)
  }

  const prevReel = () => {
    setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length)
  }

  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>
          <Video size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Learn Through Reels
        </h1>
        <p>Quick learning snippets in engaging short videos</p>
      </div>
      
      <div className="card fade-in-up" style={{ 
        animationDelay: '0.1s',
        padding: 0,
        overflow: 'hidden',
        maxWidth: '450px',
        margin: '0 auto'
      }}>
        {/* Reel Player */}
        <div style={{ 
          position: 'relative',
          height: '700px',
          backgroundColor: '#000'
        }}>
          {/* Reel Content */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '100%'
          }}>
            <img 
              src={reels[currentReel].thumbnail} 
              alt={reels[currentReel].title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
            
            {/* Play/Pause Button */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            {/* Volume Button */}
            <button 
              onClick={() => setIsMuted(!isMuted)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            {/* Reel Info */}
            <div style={{
              position: 'absolute',
              bottom: '100px',
              left: '20px',
              right: '20px',
              color: 'white'
            }}>
              <h2 style={{ 
                margin: '0 0 10px 0',
                fontSize: '1.5rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {reels[currentReel].title}
              </h2>
              <p style={{ 
                margin: 0,
                fontSize: '1rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}>
                by {reels[currentReel].author}
              </p>
            </div>
            
            {/* Interaction Buttons */}
            <div style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '25px'
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                color: 'white'
              }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '5px'
                }}>
                  <Heart size={24} />
                </button>
                <span style={{ fontSize: '0.9rem' }}>
                  {reels[currentReel].likes.toLocaleString()}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                color: 'white'
              }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '5px'
                }}>
                  <MessageCircle size={24} />
                </button>
                <span style={{ fontSize: '0.9rem' }}>
                  {reels[currentReel].comments}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                color: 'white'
              }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '5px'
                }}>
                  <Share size={24} />
                </button>
                <span style={{ fontSize: '0.9rem' }}>
                  {reels[currentReel].shares}
                </span>
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevReel}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ‹
          </button>
          
          <button 
            onClick={nextReel}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ›
          </button>
        </div>
        
        {/* Reel List */}
        <div style={{ 
          display: 'flex',
          padding: '15px',
          gap: '10px',
          borderTop: '1px solid var(--border-primary)',
          overflowX: 'auto'
        }}>
          {reels.map((reel, index) => (
            <div 
              key={reel.id}
              onClick={() => setCurrentReel(index)}
              style={{
                minWidth: '80px',
                height: '120px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                border: index === currentReel ? '2px solid var(--primary-500)' : 'none'
              }}
            >
              <img 
                src={reel.thumbnail} 
                alt={reel.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LearnThroughReelsPage