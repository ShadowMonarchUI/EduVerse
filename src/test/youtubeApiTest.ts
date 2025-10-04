// Simple test to check if YouTube API key is working
const testYouTubeApi = async () => {
  const apiKey = 'AIzaSyBSGvURufIuBRp4eLKY2jBUdwu8d1uL8qI';
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&type=video&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('YouTube API is working correctly');
      console.log('First video title:', data.items[0]?.snippet?.title);
      return true;
    } else {
      console.error('YouTube API error:', data.error?.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    return false;
  }
};

// Run the test
testYouTubeApi().then(result => {
  console.log('Test result:', result ? 'PASS' : 'FAIL');
});