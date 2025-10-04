// Check available Gemini models
const API_KEY = 'AIzaSyBSGvURufIuBRp4eLKY2jBUdwu8d1uL8qI';

async function checkModels() {
  try {
    console.log('Checking available models...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Available models:');
      if (data.models) {
        data.models.forEach(model => {
          console.log(`- ${model.name}: ${model.displayName || model.name}`);
          if (model.description) {
            console.log(`  ${model.description}`);
          }
        });
      }
    } else {
      const errorText = await response.text();
      console.error('Error:', response.status, response.statusText);
      console.error('Details:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

checkModels();