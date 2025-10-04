# HumeChatbot Component

## Overview
The HumeChatbot component is a friendly, educational AI chatbot that uses the Hume AI platform for voice and text interactions. It's designed to be a personal learning companion that asks about the user's day and provides friendly conversations for educational questions.

## Features
- Voice and text chat capabilities
- Educational-focused conversations
- Time-based greetings (morning/afternoon/evening)
- Conversation stages for better flow
- Friendly UI with animations and emojis
- Responsive design

## Conversation Flow
1. **Greeting Stage**: Welcomes the user and asks about their day
2. **Day Check Stage**: Responds to user's day and transitions to learning topics
3. **Topic Stage**: Identifies the educational topic the user wants to explore
4. **Learning Stage**: Provides explanations and asks follow-up questions
5. **Review Stage**: Reviews what was learned and asks for feedback

## Props
None - This is a self-contained component

## Usage
The component is used directly in the Dashboard.tsx file as part of the AI Friend Chatbot card.

## Key Functions
- `initializeClient()`: Sets up the Hume AI client and WebSocket connection
- `startAudioCapture()`: Begins voice recording for voice chat
- `stopAudioCapture()`: Stops voice recording
- `toggleVoiceChat()`: Toggles between voice chat on/off
- `sendTextMessage()`: Sends text messages to the Hume AI
- `disconnect()`: Ends the chat session and cleans up resources

## Educational Context
The chatbot recognizes common educational topics and provides contextually appropriate responses:
- Mathematics
- Science (Biology, Chemistry, Physics)
- History
- Language Arts
- Programming/Computer Science

## Styling
The component uses CSS-in-JS styling with animations for a friendly, engaging experience. It follows the application's design system with variables like `var(--primary-500)` for consistent theming.