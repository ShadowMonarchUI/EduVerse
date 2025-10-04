# FirebaseChat Component

## Overview
The FirebaseChat component is a real-time chat application that uses Firebase Authentication and Realtime Database for messaging. It provides a simple, functional chat interface with anonymous authentication and real-time message synchronization.

## Features
- Real-time messaging using Firebase Realtime Database
- Anonymous authentication for quick access
- Message history with timestamps
- Responsive design
- Auto-scroll to latest messages
- User presence indicators

## Component Structure
1. **Chat Header** - Displays chat title and user information
2. **Messages Container** - Shows all chat messages
3. **Message Input** - Allows users to send new messages

## Props
None - This is a self-contained component

## Usage
The component can be used directly in any React application that has Firebase configured. It handles all authentication and messaging logic internally.

## State Management
- `user` - Current Firebase user (authenticated or anonymous)
- `messages` - Array of chat messages from Firebase
- `newMessage` - Current text in the message input field
- `userName` - Display name for the current user
- `isLoading` - Loading state during authentication

## Firebase Integration
The component uses the following Firebase services:
- **Authentication** - For user identification (anonymous sign-in)
- **Realtime Database** - For storing and syncing messages

### Data Structure
```
chat/
  messages/
    {messageId}/
      id: string
      userId: string
      userName: string
      content: string
      timestamp: number
```

## Key Functions
- `handleSendMessage()` - Sends a new message to Firebase
- `handleSignOut()` - Signs out the current user
- `formatTime()` - Formats timestamps for messages

## Authentication Flow
1. On component mount, checks for existing authentication
2. If no user is authenticated, signs in anonymously
3. Assigns a display name based on user ID
4. Listens for authentication state changes

## Message Synchronization
- Uses Firebase's `onValue` listener for real-time updates
- Messages are sorted by timestamp
- New messages automatically appear for all clients
- Component cleans up listeners on unmount

## Styling
The component uses CSS-in-JS styling with the application's design system variables like `var(--primary-500)` for consistent theming.

## Error Handling
- Catches and logs authentication errors
- Handles message sending errors
- Gracefully degrades when Firebase is unavailable

## Future Enhancements
- User profile pictures
- Message reactions
- File sharing
- Message threading
- Typing indicators
- Message editing/deletion
- Rich text formatting
- Emoji picker