// Video History Service for EduVerse
// This service manages the history of watched videos and their progress

export interface VideoHistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  lastWatched: Date;
  progress: number; // 0-100
  completed: boolean;
  lastPosition: number; // in seconds
}

class VideoHistoryService {
  private readonly STORAGE_KEY = 'eduverse_video_history';
  
  // Get video history from localStorage
  getHistory(): VideoHistoryItem[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history).map((item: any) => ({
        ...item,
        lastWatched: new Date(item.lastWatched)
      })) : [];
    } catch (error) {
      console.error('Error loading video history:', error);
      return [];
    }
  }
  
  // Save video history to localStorage
  private saveHistory(history: VideoHistoryItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving video history:', error);
    }
  }
  
  // Add or update a video in history
  addVideo(video: Omit<VideoHistoryItem, 'lastWatched'>): void {
    const history = this.getHistory();
    const existingIndex = history.findIndex(item => item.id === video.id);
    
    const historyItem: VideoHistoryItem = {
      ...video,
      lastWatched: new Date()
    };
    
    if (existingIndex >= 0) {
      // Update existing item
      history[existingIndex] = {
        ...history[existingIndex],
        ...historyItem
      };
    } else {
      // Add new item
      history.unshift(historyItem);
    }
    
    // Keep only the last 50 videos
    if (history.length > 50) {
      history.splice(50);
    }
    
    this.saveHistory(history);
  }
  
  // Update progress for a video
  updateProgress(videoId: string, progress: number, position: number): void {
    const history = this.getHistory();
    const existingIndex = history.findIndex(item => item.id === videoId);
    
    if (existingIndex >= 0) {
      history[existingIndex] = {
        ...history[existingIndex],
        progress,
        lastPosition: position,
        lastWatched: new Date()
      };
      
      this.saveHistory(history);
    }
  }
  
  // Mark video as completed
  markAsCompleted(videoId: string): void {
    const history = this.getHistory();
    const existingIndex = history.findIndex(item => item.id === videoId);
    
    if (existingIndex >= 0) {
      history[existingIndex] = {
        ...history[existingIndex],
        progress: 100,
        completed: true,
        lastWatched: new Date()
      };
      
      this.saveHistory(history);
    }
  }
  
  // Remove a video from history
  removeVideo(videoId: string): void {
    const history = this.getHistory();
    const filteredHistory = history.filter(item => item.id !== videoId);
    this.saveHistory(filteredHistory);
  }
  
  // Clear all history
  clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing video history:', error);
    }
  }
  
  // Get a specific video from history
  getVideo(videoId: string): VideoHistoryItem | undefined {
    const history = this.getHistory();
    return history.find(item => item.id === videoId);
  }
  
  // Check if a video exists in history
  hasVideo(videoId: string): boolean {
    const history = this.getHistory();
    return history.some(item => item.id === videoId);
  }
}

// Create and export a singleton instance
const videoHistoryService = new VideoHistoryService();
export default videoHistoryService;