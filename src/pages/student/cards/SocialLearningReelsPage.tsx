import React, { useEffect } from 'react'
import { Users, Play, Heart, MessageCircle, Share } from 'lucide-react'

const SocialLearningReelsPage: React.FC = () => {
  useEffect(() => {
    // Dynamically load the Taggbox script
    const script = document.createElement('script')
    script.src = 'https://widget.taggbox.com/embed.min.js'
    script.async = true
    script.type = 'text/javascript'
    document.body.appendChild(script)

    // Clean up the script when component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>
          <Users size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Social Learning Reels
        </h1>
        <p>Discover educational content from our learning community</p>
      </div>
      
      <div className="card fade-in-up" style={{ 
        animationDelay: '0.1s',
        padding: 0,
        overflow: 'hidden',
        maxWidth: '450px',
        margin: '0 auto',
        height: '700px'
      }}>
        {/* Taggbox Widget Container */}
        <div style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#f8f9fa'
        }}>
          {/* Header */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '15px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderBottom: '1px solid var(--border-primary)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ 
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 600
            }}>
              <Play size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Community Reels
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                <Heart size={16} style={{ marginRight: '4px' }} />
                Like
              </button>
            </div>
          </div>
          
          {/* Taggbox Widget */}
          <div style={{ 
            width: '100%', 
            height: '100%',
            paddingTop: '60px'
          }}>
            <div className="taggbox" style={{ width: '100%', height: '100%', overflow: 'auto' }} data-widget-id="302824" data-website="1"></div>
          </div>
          
          {/* Footer Controls */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '15px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTop: '1px solid var(--border-primary)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Heart size={24} />
              <span style={{ fontSize: '0.8rem' }}>Like</span>
            </button>
            
            <button style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}>
              <MessageCircle size={24} />
              <span style={{ fontSize: '0.8rem' }}>Comment</span>
            </button>
            
            <button style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Share size={24} />
              <span style={{ fontSize: '0.8rem' }}>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialLearningReelsPage