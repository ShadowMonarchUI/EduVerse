import React, { useState, useEffect } from 'react';
import { Video, Clock, CheckCircle, Play, History } from 'lucide-react';
import videoHistoryService from '../services/videoHistoryService';
import type { VideoHistoryItem } from '../services/videoHistoryService';

interface VideoHistoryProps {
  onVideoSelect: (video: any) => void;
}

const VideoHistory: React.FC<VideoHistoryProps> = ({ onVideoSelect }) => {
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const historyItems = videoHistoryService.getHistory();
      setHistory(historyItems);
    } catch (error) {
      console.error('Error loading video history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Format progress for display
  const formatProgress = (progress: number): string => {
    if (progress >= 100) {
      return 'Completed';
    } else if (progress > 0) {
      return `${Math.round(progress)}% watched`;
    } else {
      return 'Not started';
    }
  };

  // Handle clear history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your video history?')) {
      videoHistoryService.clearHistory();
      setHistory([]);
    }
  };

  // Convert duration string to seconds
  const convertDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
      // MM:SS format
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading video history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <History size={48} style={{ margin: '0 auto 20px', color: 'var(--secondary-300)' }} />
        <h3>No Video History</h3>
        <p>You haven't watched any videos yet.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
          Watch educational videos to build your history and track your progress.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <History size={24} style={{ color: 'var(--secondary-600)' }} />
          Your Video History
        </h2>
        <button 
          className="btn btn-secondary"
          onClick={handleClearHistory}
          style={{ padding: '8px 16px' }}
        >
          Clear History
        </button>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {history.map((item) => (
          <div 
            key={item.id}
            className="card"
            style={{ 
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: 'var(--bg-secondary)'
            }}
            onClick={() => onVideoSelect({
              id: item.id,
              title: item.title,
              thumbnail: item.thumbnail,
              channel: item.channel,
              duration: item.duration,
              views: 'N/A', // We don't store views in history
              description: 'Continue watching from your last position',
              progress: item.progress,
              lastPosition: item.lastPosition
            })}
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
              backgroundImage: `url(${item.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {item.completed ? (
                <div style={{ 
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'var(--success-500)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle size={14} />
                  Completed
                </div>
              ) : item.progress > 0 ? (
                <div style={{ 
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'var(--primary-500)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Play size={14} />
                  {Math.round(item.progress)}%
                </div>
              ) : (
                <div style={{ 
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem'
                }}>
                  <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {item.duration}
                </div>
              )}
              
              {item.lastPosition > 0 && item.progress < 100 && (
                <div style={{ 
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem'
                }}>
                  Position: {formatTime(item.lastPosition)}
                </div>
              )}
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
                {item.title}
              </h4>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: '10px'
              }}>
                <span>{item.channel}</span>
                <span>{formatDate(item.lastWatched)}</span>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    height: '6px',
                    backgroundColor: 'var(--border-primary)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%',
                      width: `${item.progress}%`,
                      backgroundColor: item.completed ? 'var(--success-500)' : 'var(--primary-500)',
                      borderRadius: 'var(--radius-full)'
                    }}></div>
                  </div>
                </div>
                <span style={{ 
                  fontSize: '0.8rem',
                  color: item.completed ? 'var(--success-500)' : 'var(--text-secondary)'
                }}>
                  {formatProgress(item.progress)}
                </span>
              </div>
              
              {item.lastPosition > 0 && item.progress < 100 && (
                <div style={{ 
                  marginTop: '10px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Play size={14} />
                  Continue from {formatTime(item.lastPosition)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoHistory;