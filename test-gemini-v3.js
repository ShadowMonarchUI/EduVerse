// Test script to verify Gemini API with correct model and simpler config
const API_KEY = 'AIzaSyBSGvURufIuBRp4eLKY2jBUdwu8d1uL8qI';

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API with key:', API_KEY.substring(0, 10) + '...');
    console.log('Using model: gemini-2.5-flash');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Explain how AI works in exactly 10 words'
            }]
          }]
        })
      }
    );
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success!');
      console.log('Full response:', JSON.stringify(data, null, 2));
      
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        console.log('Generated text:', text);
      } else {
        console.log('No content generated or unexpected response structure');
      }
    } else {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText);
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testGeminiAPI();