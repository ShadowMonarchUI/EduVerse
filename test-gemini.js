// Simple test script to verify Gemini API key
// Run with: node test-gemini.js

const API_KEY = 'AIzaSyBSGvURufIuBRp4eLKY2jBUdwu8d1uL8qI'; // Your API key

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API with key:', API_KEY.substring(0, 10) + '...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say "Hello, World!" in English only.'
            }]
          }]
        })
      }
    );
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        console.log('\nGenerated text:', text);
      }
    } else {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText);
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testGeminiAPI();