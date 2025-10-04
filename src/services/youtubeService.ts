// YouTube API Service for EduVerse
// This service fetches popular educational videos related to topics

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  channel: string;
  channelId: string;
  publishedAt: string;
  // Add progress tracking properties
  progress?: number; // Percentage watched (0-100)
  completed?: boolean; // Whether the video is marked as completed
  lastPosition?: number; // Last watched position in seconds
}

// Mock data for when API key is not available
const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'HQKwgkVGvNQ',
    title: 'Introduction to Machine Learning for Beginners',
    description: 'Learn the fundamentals of machine learning algorithms and applications. This comprehensive tutorial covers supervised and unsupervised learning techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&h=200&fit=crop',
    duration: '22:30',
    views: '120K views',
    channel: 'AI Learning Academy',
    channelId: 'UCaiLearningHub',
    publishedAt: '2023-05-15',
    progress: 0,
    completed: false
  },
  {
    id: 'rfscVS0vtbw',
    title: 'Python for Data Science - Full Course',
    description: 'Master Python programming for data analysis and visualization. Learn NumPy, Pandas, Matplotlib, and Seaborn in this comprehensive tutorial.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop',
    duration: '18:45',
    views: '3.4M views',
    channel: 'Code Academy',
    channelId: 'UCcodeAcademy',
    publishedAt: '2023-06-22',
    progress: 0,
    completed: false
  },
  {
    id: 'JnujZYlJ5x0',
    title: 'Quantum Computing Basics Explained',
    description: 'Explore the principles of quantum computing and its potential applications. Understand qubits, superposition, and entanglement in simple terms.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop',
    duration: '15:22',
    views: '80K views',
    channel: 'Future Tech Education',
    channelId: 'UCfutureTech',
    publishedAt: '2023-07-10',
    progress: 0,
    completed: false
  },
  {
    id: 'aircAruvnKk',
    title: 'Neural Networks Explained Simply',
    description: 'Deep dive into neural networks and how they power modern AI systems. Learn about perceptrons, activation functions, and backpropagation.',
    thumbnail: 'https://images.unsplash.com/photo-1677442135722-5f11e06a4e6d?w=300&h=200&fit=crop',
    duration: '22:10',
    views: '2.1M views',
    channel: 'AI Learning Hub',
    channelId: 'UCaiLearningHub',
    publishedAt: '2023-08-05',
    progress: 0,
    completed: false
  },
  {
    id: 'KeLxIcS0HVc',
    title: 'Web Development with React - Complete Guide',
    description: 'Build modern web applications with React and JavaScript. Learn components, hooks, state management, and routing in this full tutorial.',
    thumbnail: 'https://images.unsplash.com/photo-1555066932-4365d14bab8c?w=300&h=200&fit=crop',
    duration: '25:18',
    views: '4.7M views',
    channel: 'Web Masters',
    channelId: 'UCwebMasters',
    publishedAt: '2023-09-12',
    progress: 0,
    completed: false
  },
  {
    id: 'M5S_JBRGJRI',
    title: 'Blockchain Technology Explained',
    description: 'Understand how blockchain works and its applications beyond cryptocurrency. Learn about distributed ledgers, smart contracts, and consensus mechanisms.',
    thumbnail: 'https://images.unsplash.com/photo-1620336655052-b57986f5a26a?w=300&h=200&fit=crop',
    duration: '19:35',
    views: '1.8M views',
    channel: 'Crypto Insights',
    channelId: 'UCcryptoInsights',
    publishedAt: '2023-10-20',
    progress: 0,
    completed: false
  },
  {
    id: '7T3G5m2X4J4',
    title: 'Calculus Fundamentals for Students',
    description: 'Learn the basics of calculus including limits, derivatives, and integrals. Perfect for high school and college students preparing for exams.',
    thumbnail: 'https://images.unsplash.com/photo-1509225770129-fbcf8a69e5f5?w=300&h=200&fit=crop',
    duration: '32:15',
    views: '540K views',
    channel: 'Math Made Easy',
    channelId: 'UCmathMadeEasy',
    publishedAt: '2023-11-05',
    progress: 0,
    completed: false
  },
  {
    id: '8mAITcNt710',
    title: 'History of Ancient Civilizations',
    description: 'Explore the rise and fall of ancient civilizations including Egypt, Rome, Greece, and Mesopotamia. Learn about their contributions to modern society.',
    thumbnail: 'https://images.unsplash.com/photo-15834504-1b4d-4d4d-8b0e-4a5b5b6c9d8c?w=300&h=200&fit=crop',
    duration: '45:30',
    views: '2.3M views',
    channel: 'History Channel Education',
    channelId: 'UChistoryEducation',
    publishedAt: '2023-12-12',
    progress: 0,
    completed: false
  }
];

/**
 * Format view count to a more readable format
 * @param viewCount - The raw view count as a string
 * @returns Formatted view count (e.g., 1.2K, 3.4M)
 */
const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount, 10);
  if (isNaN(count)) return '0 views';
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  } else {
    return `${count} views`;
  }
};

/**
 * Parse ISO 8601 duration format to HH:MM:SS format
 * @param duration - ISO 8601 duration string (e.g., PT12M30S)
 * @returns Formatted duration (e.g., 12:30)
 */
const parseISO8601Duration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Get user's language and region for better search results
 * @returns Object with language and region codes
 */
const getUserLocale = () => {
  const locale = navigator.language || 'en-US';
  const [language, region] = locale.split('-');
  return {
    language: language || 'en',
    region: region || 'US'
  };
};

/**
 * Check if a video is education-related based on title and description
 * @param title - Video title
 * @param description - Video description
 * @returns boolean - True if video appears to be educational
 */
const isEducationRelated = (title: string, description: string): boolean => {
  const educationKeywords = [
    'tutorial', 'course', 'learn', 'education', 'lecture', 'lesson', 'how to', 'explained',
    'introduction', 'basics', 'fundamentals', 'beginner', 'guide', 'walkthrough', 'training',
    'workshop', 'seminar', 'class', 'academy', 'school', 'university', 'study', 'research',
    'science', 'math', 'mathematics', 'physics', 'chemistry', 'biology', 'history', 'geography',
    'literature', 'language', 'programming', 'coding', 'development', 'technology', 'tech',
    'computer', 'software', 'engineering', 'design', 'art', 'music', 'economics', 'business',
    'finance', 'marketing', 'psychology', 'philosophy', 'medicine', 'health', 'fitness',
    'cooking', 'recipe', 'nutrition', 'garden', 'diy', 'craft', 'project'
  ];
  
  const titleLower = title.toLowerCase();
  const descriptionLower = description.toLowerCase();
  
  // Check if it contains education keywords
  const hasEducationKeywords = educationKeywords.some(keyword => 
    titleLower.includes(keyword) || descriptionLower.includes(keyword)
  );
  
  // Check if it's an explanation/video format
  const explanationFormats = ['explained', 'tutorial', 'lecture', 'lesson', 'guide', 'introduction'];
  const isExplanationFormat = explanationFormats.some(format => 
    titleLower.includes(format) || descriptionLower.includes(format)
  );
  
  return hasEducationKeywords && isExplanationFormat;
};

/**
 * Check if a video is relevant to the search term
 * @param title - Video title
 * @param description - Video description
 * @param searchTerm - The search term used
 * @returns boolean - True if video is relevant to the search term
 */
const isRelevantToSearch = (title: string, description: string, searchTerm: string): boolean => {
  const titleLower = title.toLowerCase();
  const descriptionLower = description.toLowerCase();
  const searchTermLower = searchTerm.toLowerCase();
  
  // Split search term into words
  const searchWords = searchTermLower.split(' ').filter(word => word.length > 2);
  
  // Check if at least one search word is in title or description
  const hasRelevantKeywords = searchWords.length === 0 || searchWords.some(word => 
    titleLower.includes(word) || descriptionLower.includes(word)
  );
  
  return hasRelevantKeywords;
};

/**
 * Fetch popular videos related to a search term
 * Following YouTube Data API v3 search/list documentation
 * @param searchTerm - The topic to search for
 * @param maxResults - Maximum number of results to return (default: 12, max: 50)
 * @returns Promise<YouTubeVideo[]> - Array of video objects
 */
export const fetchPopularVideos = async (searchTerm: string, maxResults: number = 12): Promise<YouTubeVideo[]> => {
  // Validate maxResults according to API limits
  const validatedMaxResults = Math.min(Math.max(maxResults, 1), 50);
  
  // Check if YouTube API key is available
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  // If no API key, return mock data
  if (!apiKey) {
    console.warn('YouTube API key not found. Using mock data.');
    return MOCK_VIDEOS.filter(video => 
      (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchTerm.toLowerCase())) &&
      isEducationRelated(video.title, video.description)
    );
  }
  
  try {
    // Get user's locale for better search results
    const { language, region } = getUserLocale();
    
    // Build search parameters following YouTube Data API v3 specifications
    const searchParams = new URLSearchParams({
      part: 'snippet',
      maxResults: (validatedMaxResults * 3).toString(), // Fetch more to filter
      q: `${searchTerm} tutorial OR lecture OR explained OR introduction`,
      type: 'video',
      key: apiKey,
      order: 'relevance', // Order by relevance for better matching
      relevanceLanguage: language,
      regionCode: region,
      safeSearch: 'strict',
      videoEmbeddable: 'true',
      videoSyndicated: 'true',
      videoDuration: 'any', // Allow any duration
      fields: 'items(id/videoId,snippet/title,snippet/description,snippet/thumbnails/medium,snippet/channelTitle,snippet/channelId,snippet/publishedAt)'
    });
    
    // Fetch videos from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${searchParams}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Filter for education-related and relevant videos
    const filteredVideos = data.items.filter((item: any) => 
      isEducationRelated(item.snippet.title, item.snippet.description) &&
      isRelevantToSearch(item.snippet.title, item.snippet.description, searchTerm)
    );
    
    // Limit to requested number of results
    const relevantVideos = filteredVideos.slice(0, validatedMaxResults);
    
    // Extract video IDs to get duration and view count
    if (relevantVideos.length === 0) {
      return [];
    }
    
    const videoIds = relevantVideos.map((item: any) => item.id.videoId).join(',');
    
    // Fetch video details (duration, view count)
    const detailsParams = new URLSearchParams({
      part: 'contentDetails,statistics',
      id: videoIds,
      key: apiKey,
      fields: 'items(id,contentDetails/duration,statistics/viewCount)'
    });
    
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${detailsParams}`
    );
    
    if (!detailsResponse.ok) {
      const errorData = await detailsResponse.json();
      throw new Error(`YouTube API error: ${detailsResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    // Create a map of video details by ID for easy lookup
    const detailsMap: Record<string, any> = {};
    detailsData.items.forEach((item: any) => {
      detailsMap[item.id] = item;
    });
    
    // Combine search results with video details
    const videos: YouTubeVideo[] = relevantVideos.map((item: any) => {
      const details = detailsMap[item.id.videoId];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channel: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        duration: details ? parseISO8601Duration(details.contentDetails.duration) : '0:00',
        views: details ? formatViewCount(details.statistics.viewCount) : '0 views'
      };
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    // Return mock data as fallback
    return MOCK_VIDEOS.filter(video => 
      (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchTerm.toLowerCase())) &&
      isEducationRelated(video.title, video.description)
    );
  }
};

/**
 * Fetch popular short educational videos (reels) related to a search term
 * @param searchTerm - The topic to search for
 * @param maxResults - Maximum number of results to return (default: 12, max: 50)
 * @returns Promise<YouTubeVideo[]> - Array of short video objects
 */
export const fetchShortEducationalVideos = async (searchTerm: string, maxResults: number = 12): Promise<YouTubeVideo[]> => {
  // Validate maxResults according to API limits
  const validatedMaxResults = Math.min(Math.max(maxResults, 1), 50);
  
  // Check if YouTube API key is available
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  // If no API key, return mock data
  if (!apiKey) {
    console.warn('YouTube API key not found. Using mock data.');
    return MOCK_VIDEOS.filter(video => 
      (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, validatedMaxResults);
  }
  
  try {
    // Get user's locale for better search results
    const { language, region } = getUserLocale();
    
    // Build search parameters for short videos - less strict filtering
    const searchParams = new URLSearchParams({
      part: 'snippet',
      maxResults: (validatedMaxResults * 3).toString(), // Fetch more to have options
      q: `${searchTerm} short`, // Less strict search terms
      type: 'video',
      key: apiKey,
      order: 'relevance',
      relevanceLanguage: language,
      regionCode: region,
      safeSearch: 'strict',
      videoEmbeddable: 'true',
      videoSyndicated: 'true',
      videoDuration: 'short', // Videos under 4 minutes
      videoDefinition: 'high',
      fields: 'items(id/videoId,snippet/title,snippet/description,snippet/thumbnails/medium,snippet/channelTitle,snippet/channelId,snippet/publishedAt)'
    });
    
    // Fetch videos from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${searchParams}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Limit to requested number of results (without strict education filtering)
    const relevantVideos = data.items.slice(0, validatedMaxResults);
    
    // Extract video IDs to get duration and view count
    if (relevantVideos.length === 0) {
      return [];
    }
    
    const videoIds = relevantVideos.map((item: any) => item.id.videoId).join(',');
    
    // Fetch video details (duration, view count)
    const detailsParams = new URLSearchParams({
      part: 'contentDetails,statistics',
      id: videoIds,
      key: apiKey,
      fields: 'items(id,contentDetails/duration,statistics/viewCount)'
    });
    
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${detailsParams}`
    );
    
    if (!detailsResponse.ok) {
      const errorData = await detailsResponse.json();
      throw new Error(`YouTube API error: ${detailsResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    // Create a map of video details by ID for easy lookup
    const detailsMap: Record<string, any> = {};
    detailsData.items.forEach((item: any) => {
      detailsMap[item.id] = item;
    });
    
    // Combine search results with video details and filter for short videos
    const videos: YouTubeVideo[] = [];
    relevantVideos.forEach((item: any) => {
      const details = detailsMap[item.id.videoId];
      if (details) {
        const duration = parseISO8601Duration(details.contentDetails.duration);
        // Filter for videos under 4 minutes (240 seconds) - more lenient for "reels"
        const durationParts = duration.split(':').map(Number);
        let totalSeconds = 0;
        if (durationParts.length === 2) {
          // MM:SS
          totalSeconds = durationParts[0] * 60 + durationParts[1];
        } else if (durationParts.length === 3) {
          // HH:MM:SS
          totalSeconds = durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2];
        }
        
        // Include videos under 4 minutes (more inclusive for "reels")
        if (totalSeconds < 240) {
          videos.push({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
            channel: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            publishedAt: item.snippet.publishedAt,
            duration: duration,
            views: formatViewCount(details.statistics.viewCount)
          });
        }
      }
    });
    
    // If we still don't have enough videos, try with a broader search
    if (videos.length < validatedMaxResults) {
      // Try with just the search term
      const additionalParams = new URLSearchParams({
        part: 'snippet',
        maxResults: (validatedMaxResults * 2).toString(),
        q: searchTerm,
        type: 'video',
        key: apiKey,
        order: 'relevance',
        relevanceLanguage: language,
        regionCode: region,
        safeSearch: 'strict',
        videoEmbeddable: 'true',
        videoSyndicated: 'true',
        videoDuration: 'short',
        videoDefinition: 'high',
        fields: 'items(id/videoId,snippet/title,snippet/description,snippet/thumbnails/medium,snippet/channelTitle,snippet/channelId,snippet/publishedAt)'
      });
      
      const additionalResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${additionalParams}`
      );
      
      if (additionalResponse.ok) {
        const additionalData = await additionalResponse.json();
        
        const additionalVideoIds = additionalData.items.map((item: any) => item.id.videoId).join(',');
        
        if (additionalVideoIds) {
          const additionalDetailsParams = new URLSearchParams({
            part: 'contentDetails,statistics',
            id: additionalVideoIds,
            key: apiKey,
            fields: 'items(id,contentDetails/duration,statistics/viewCount)'
          });
          
          const additionalDetailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?${additionalDetailsParams}`
          );
          
          if (additionalDetailsResponse.ok) {
            const additionalDetailsData = await additionalDetailsResponse.json();
            const additionalDetailsMap: Record<string, any> = {};
            additionalDetailsData.items.forEach((item: any) => {
              additionalDetailsMap[item.id] = item;
            });
            
            additionalData.items.forEach((item: any) => {
              const details = additionalDetailsMap[item.id.videoId];
              if (details && videos.length < validatedMaxResults) {
                const duration = parseISO8601Duration(details.contentDetails.duration);
                const durationParts = duration.split(':').map(Number);
                let totalSeconds = 0;
                if (durationParts.length === 2) {
                  totalSeconds = durationParts[0] * 60 + durationParts[1];
                } else if (durationParts.length === 3) {
                  totalSeconds = durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2];
                }
                
                if (totalSeconds < 240) {
                  videos.push({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
                    channel: item.snippet.channelTitle,
                    channelId: item.snippet.channelId,
                    publishedAt: item.snippet.publishedAt,
                    duration: duration,
                    views: formatViewCount(details.statistics.viewCount)
                  });
                }
              }
            });
          }
        }
      }
    }
    
    return videos.slice(0, validatedMaxResults);
  } catch (error) {
    console.error('Error fetching YouTube short videos:', error);
    // Return mock data as fallback
    return MOCK_VIDEOS.filter(video => 
      (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, validatedMaxResults);
  }
};

/**
 * Fetch video details by ID
 * @param videoId - The YouTube video ID
 * @returns Promise<YouTubeVideo | null> - Detailed video object
 */
export const fetchVideoById = async (videoId: string): Promise<YouTubeVideo | null> => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('YouTube API key not found.');
    return null;
  }
  
  try {
    // Fetch video details
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: apiKey,
      fields: 'items(id,snippet/title,snippet/description,snippet/thumbnails/medium,snippet/channelTitle,snippet/channelId,snippet/publishedAt,contentDetails/duration,statistics/viewCount)'
    });
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channel: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        duration: parseISO8601Duration(item.contentDetails.duration),
        views: formatViewCount(item.statistics.viewCount),
        progress: 0, // Will be set by history
        completed: false // Will be set by history
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

/**
 * Fetch video details including duration and view count
 * Following YouTube Data API v3 videos/list documentation
 * @param videoId - The YouTube video ID
 * @returns Promise<YouTubeVideo> - Detailed video object
 */
export const fetchVideoDetails = async (videoId: string): Promise<YouTubeVideo | null> => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('YouTube API key not found. Using mock data.');
    return MOCK_VIDEOS.find(video => video.id === videoId) || null;
  }
  
  try {
    // Fetch video details following API specifications
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: apiKey,
      fields: 'items(id,snippet/title,snippet/description,snippet/thumbnails/medium,snippet/channelTitle,snippet/channelId,snippet/publishedAt,contentDetails/duration,statistics/viewCount)'
    });
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      // Check if video is education-related
      if (!isEducationRelated(item.snippet.title, item.snippet.description)) {
        return null; // Not education-related
      }
      
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channel: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        duration: parseISO8601Duration(item.contentDetails.duration),
        views: formatViewCount(item.statistics.viewCount)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return MOCK_VIDEOS.find(video => video.id === videoId) || null;
  }
};

/**
 * Update video progress
 * @param videoId - The YouTube video ID
 * @param progress - Progress percentage (0-100)
 * @param position - Current position in seconds
 */
export const updateVideoProgress = (videoId: string, progress: number, position: number): void => {
  // In a real implementation, this would update the user's progress in a database
  console.log(`Updated progress for video ${videoId}: ${progress}% at ${position}s`);
  // For now, we'll just log it
};

/**
 * Mark video as completed
 * @param videoId - The YouTube video ID
 */
export const markVideoAsCompleted = (videoId: string): void => {
  // In a real implementation, this would mark the video as completed in a database
  console.log(`Marked video ${videoId} as completed`);
  // For now, we'll just log it
};