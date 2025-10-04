// Test both Gemini services to verify they're using the correct model
import { generateContent as sdkGenerate } from './src/services/geminiService.ts';
import { generateContent as restGenerate } from './src/services/geminiRestService.ts';

async function testBothServices() {
  console.log('Testing both Gemini services with gemini-2.5-flash model');
  
  const testPrompt = 'Explain AI in 5 words';
  
  try {
    console.log('\n--- Testing SDK Service ---');
    const sdkResult = await sdkGenerate(testPrompt);
    console.log('SDK Result:', sdkResult);
  } catch (error) {
    console.error('SDK Test Error:', error.message);
  }
  
  try {
    console.log('\n--- Testing REST Service ---');
    const restResult = await restGenerate(testPrompt);
    console.log('REST Result:', restResult);
  } catch (error) {
    console.error('REST Test Error:', error.message);
  }
}

testBothServices();