import React, { useState, useEffect, useRef } from 'react';
import videoHistoryService from '../services/videoHistoryService';

// Declare YouTube Player API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoProgressTrackerProps {
  videoId: string;
  videoDuration: string; // Format: "MM:SS" or "HH:MM:SS"
  videoTitle: string;
  videoThumbnail: string;
  videoChannel: string;
  onProgressUpdate: (progress: number) => void;
  onCompletion: () => void;
}

const VideoProgressTracker: React.FC<VideoProgressTrackerProps> = ({ 
  videoId, 
  videoDuration,
  videoTitle,
  videoThumbnail,
  videoChannel,
  onProgressUpdate,
  onCompletion
}) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const progressUpdateInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Initialize total duration and load saved progress
  useEffect(() => {
    const durationInSeconds = convertDurationToSeconds(videoDuration);
    setTotalDuration(durationInSeconds);
    
    // Load saved progress from history
    const historyItem = videoHistoryService.getVideo(videoId);
    if (historyItem) {
      setProgress(historyItem.progress);
      setCurrentTime(historyItem.lastPosition);
      setIsCompleted(historyItem.completed);
    }
  }, [videoDuration, videoId]);

  // Initialize YouTube Player API
  useEffect(() => {
    // Load YouTube Player API if not already loaded
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
      
      // Set up global callback
      window.onYouTubeIframeAPIReady = () => {
        // API is loaded, initialize player
        initializePlayer();
      };
    } else {
      // API is already loaded
      initializePlayer();
    }
    
    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, [videoId]);

  // Initialize YouTube player
  const initializePlayer = () => {
    if (typeof window.YT !== 'undefined' && window.YT.Player) {
      // Destroy existing player if any
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      
      // Create new player
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
  };

  // Player ready event
  const onPlayerReady = (event: any) => {
    // Player is ready
    console.log('YouTube player is ready');
    
    // If we have saved progress, seek to that position
    const historyItem = videoHistoryService.getVideo(videoId);
    if (historyItem && historyItem.lastPosition > 0) {
      // Small delay to ensure player is ready
      setTimeout(() => {
        event.target.seekTo(historyItem.lastPosition, true);
      }, 100);
    }
  };

  // Player state change event
  const onPlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        startProgressTracking();
        break;
      case window.YT.PlayerState.PAUSED:
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        stopProgressTracking();
        if (event.data === window.YT.PlayerState.ENDED) {
          handleVideoEnd();
        }
        break;
    }
  };

  // Start progress tracking
  const startProgressTracking = () => {
    if (progressUpdateInterval.current) return;
    
    progressUpdateInterval.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = totalDuration > 0 ? totalDuration : playerRef.current.getDuration();
          const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
          
          setCurrentTime(currentTime);
          setProgress(progressPercent);
          onProgressUpdate(progressPercent);
          
          // Save progress to history
          videoHistoryService.addVideo({
            id: videoId,
            title: videoTitle,
            thumbnail: videoThumbnail,
            channel: videoChannel,
            duration: videoDuration,
            progress: progressPercent,
            completed: progressPercent >= 100,
            lastPosition: currentTime
          });
          
          // Check if video is completed
          if (progressPercent >= 100) {
            handleVideoEnd();
          }
        } catch (error) {
          console.error('Error getting player state:', error);
        }
      }
    }, 500); // Update every 500ms for smoother progress
  };

  // Stop progress tracking
  const stopProgressTracking = () => {
    if (progressUpdateInterval.current) {
      clearInterval(progressUpdateInterval.current);
      progressUpdateInterval.current = null;
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    setProgress(100);
    setCurrentTime(totalDuration);
    onCompletion();
    stopProgressTracking();
    
    // Mark as completed in history
    videoHistoryService.markAsCompleted(videoId);
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    const newProgress = totalDuration > 0 ? (newTime / totalDuration) * 100 : 0;
    setProgress(newProgress);
    onProgressUpdate(newProgress);
    
    // Save progress to history
    videoHistoryService.addVideo({
      id: videoId,
      title: videoTitle,
      thumbnail: videoThumbnail,
      channel: videoChannel,
      duration: videoDuration,
      progress: newProgress,
      completed: newProgress >= 100,
      lastPosition: newTime
    });
    
    // Seek the YouTube player if available
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(newTime, true);
    }
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Handle mark as completed
  const handleMarkAsCompleted = () => {
    setCurrentTime(totalDuration);
    setProgress(100);
    setIsCompleted(true);
    onCompletion();
    stopProgressTracking();
    
    // Mark as completed in history
    videoHistoryService.markAsCompleted(videoId);
    
    // Seek to end of video
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(totalDuration, true);
    }
  };

  // Handle reset
  const handleReset = () => {
    setCurrentTime(0);
    setProgress(0);
    setIsCompleted(false);
    setIsPlaying(false);
    stopProgressTracking();
    
    // Reset progress in history
    videoHistoryService.addVideo({
      id: videoId,
      title: videoTitle,
      thumbnail: videoThumbnail,
      channel: videoChannel,
      duration: videoDuration,
      progress: 0,
      completed: false,
      lastPosition: 0
    });
    
    // Seek to beginning of video
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(0, true);
    }
  };

  return (
    <div style={{ 
      marginTop: '20px',
      padding: '20px',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <h4 style={{ 
        margin: '0 0 15px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          borderRadius: '50%', 
          backgroundColor: isCompleted ? 'var(--success-500)' : 'var(--primary-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isCompleted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          ) : (
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'white'
            }}></div>
          )}
        </div>
        Learning Progress
      </h4>
      
      {/* Progress Bar */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="range"
          min="0"
          max={totalDuration}
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            background: `linear-gradient(to right, var(--primary-500) ${progress}%, var(--border-primary) ${progress}%)`,
            outline: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none'
          }}
        />
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '5px',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{videoDuration}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            height: '10px',
            backgroundColor: 'var(--border-primary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%',
              width: `${progress}%`,
              backgroundColor: isCompleted ? 'var(--success-500)' : 'var(--primary-500)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '5px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <span>{progress.toFixed(1)}%</span>
            <span>{isCompleted ? 'Completed' : isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isCompleted ? (
            <>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px' }}
                onClick={handlePlayPause}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '8px 16px' }}
                onClick={handleMarkAsCompleted}
              >
                Mark as Complete
              </button>
            </>
          ) : (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px' }}
              onClick={handleReset}
            >
              Reset Progress
            </button>
          )}
        </div>
      </div>
      
      <div style={{ 
        marginTop: '15px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        fontStyle: 'italic'
      }}>
        Progress automatically tracks with video playback. The bar pauses when the video is paused and updates when seeking.
      </div>
    </div>
  );
};

export default VideoProgressTracker;