# EduVerse Group Chat Component

## Overview

The EduGroupChat component is a modern, educational-focused group chat interface that allows users to collaborate in subject-specific study groups. It features a clean, intuitive design with a sidebar for group navigation and a main chat area for conversations.

## Features

1. **Subject-Specific Groups**: Predefined study groups for different subjects
2. **Modern UI Design**: Clean, educational-themed interface with EduVerse branding
3. **Responsive Layout**: Adapts to different screen sizes
4. **Real-time Messaging**: Firebase integration for instant message delivery
5. **User Authentication**: Anonymous sign-in with fallback to mock authentication
6. **Group Navigation**: Easy switching between different study groups
7. **Profile Integration**: User profile display with online status
8. **Enhanced Messaging**: Support for mentions, file attachments, and emojis

## Component Structure

### Main Sections

1. **Header**: Application title and user controls
2. **Groups Sidebar**: Navigation between study groups
3. **Group Header**: Current group information
4. **Messages Area**: Conversation display with message bubbles
5. **Input Area**: Message composition with enhanced controls

### UI Elements

- Gradient headers with EduVerse color scheme
- Rounded corners and subtle shadows
- Smooth hover animations and transitions
- Clear visual distinction between sent/received messages
- Group-specific avatars and icons
- Enhanced input area with attachment options

## Implementation Details

### Authentication Flow

1. Attempts to use existing Firebase authentication
2. Falls back to anonymous sign-in if no user exists
3. Creates mock user if Firebase authentication fails
4. Persists user name in localStorage

### Group Management

1. Predefined subject groups (General, Math, Science, Literature, History)
2. Group switching with visual indication of active group
3. Member counts for each group
4. Group-specific avatars with subject icons

### Message Handling

1. Listens for real-time message updates using `onValue`
2. Sorts messages by timestamp
3. Displays sender name, avatar, and timestamp for each message
4. Highlights messages sent by the current user
5. Auto-scrolls to newest messages

### Styling Approach

- Uses Tailwind CSS utility classes for consistent styling
- Follows EduVerse color palette (blue to indigo gradients)
- Implements responsive design with mobile-first approach
- Includes dark mode support through CSS variables

## Usage

### In Dashboard

The component is integrated into the Dashboard as the 5th card (Group Chat):

```tsx
import EduGroupChat from '../components/EduGroupChat'

// In Dashboard render function
<div style={{ flex: 1, minHeight: 0 }}>
  <EduGroupChat />
</div>
```

### Standalone Test Page

A test page is available at `/edu-group-chat` for development and testing.

## Error Handling

The component gracefully handles several error scenarios:

1. **Authentication Failures**: Falls back to mock authentication
2. **Network Issues**: Displays user-friendly error messages
3. **Permission Denied**: Provides clear guidance for resolution
4. **Loading States**: Shows spinner during initialization

## Customization

### Theme Variables

The component uses the following EduVerse theme variables:
- Primary colors: `blue-500` to `indigo-600` gradients
- Background colors: `white`, `blue-50`, `indigo-50`
- Text colors: `gray-900`, `gray-700`, `gray-600`, `gray-500`
- Border colors: `gray-200`, `gray-300`

### Responsive Breakpoints

- Mobile: Single column layout with hidden sidebar
- Tablet/Desktop: Two-column layout with visible sidebar

## Testing

### Manual Testing Steps

1. Navigate to `/edu-group-chat` or the Group Chat card in Dashboard
2. Enter a display name and click "Join Learning Groups"
3. Select a study group from the sidebar
4. Type a message and send it
5. Verify the message appears in the chat
6. Switch to another group and verify the interface updates
7. Open another browser tab and repeat steps 2-5
8. Verify messages appear in real-time across both tabs

### Automated Testing

The component includes:
- Type safety with TypeScript interfaces
- Error boundary protection
- Accessibility considerations
- Performance optimizations

## Future Enhancements

1. **Group Creation**: Allow users to create new study groups
2. **User Presence**: Online/offline status indicators
3. **Message Reactions**: Emoji reactions to messages
4. **File Sharing**: Image and document sharing capabilities
5. **Private Messaging**: Direct messaging between users
6. **Message Editing**: Edit and delete sent messages
7. **Search Functionality**: Search within messages and groups
8. **Notifications**: Real-time notifications for mentions and new messages
9. **Study Resources**: Integration with educational resources
10. **Moderation Tools**: Admin controls for group management