# EduVerseMemeChat Component

A fully functional group chat implementation inspired by the MemeChat example, with enhanced UI/UX and Firebase integration.

## Features

- User name registration with localStorage persistence
- Group creation and management
- Real-time messaging within groups
- Message history with timestamps
- User logout functionality
- Responsive design with MemeChat-inspired styling
- Default "General Chat" group for everyone
- Automatic default group creation if none exists

## Implementation Details

### Data Structure

The component uses Firebase Realtime Database with the following structure:

```
edumeme_groups/
  group_id/
    id: string
    name: string
    createdAt: number
    createdBy: string

edumeme_messages/
  group_id/
    message_id/
      id: string
      name: string
      message: string
      timestamp: number
      groupId: string
```

### Core Functionality

1. **User Authentication**: Users enter their name to join the chat system
2. **Group Management**: Users can create new groups or join existing ones
3. **Real-time Messaging**: Messages are sent and received in real-time using Firebase listeners
4. **Message History**: All messages are stored and displayed chronologically
5. **UI State Management**: Active group tracking, message input handling, and UI updates
6. **Default Group**: Automatic creation and joining of a default "General Chat" group

### Styling

The component uses the same fonts as the original MemeChat:
- **Bungee Outline** for headings
- **Varela Round** for body text

The color scheme follows the MemeChat aesthetic:
- Primary color: #D64045 (red)
- Secondary color: #1D3354 (dark blue)
- Background colors: #f0f0f0, #f9f9f9, #fff

## Usage

1. Enter your name to join the chat
2. Create a new group or select an existing one
3. Start sending messages to your group
4. Logout when finished

## Component Structure

```tsx
<EduVerseMemeChat />
```

The component manages all its own state and Firebase connections internally.

## Dependencies

- React
- Firebase Realtime Database
- lucide-react (for icons)

## Key Differences from Previous Implementation

1. **MemeChat Aesthetics**: Uses the same color scheme and fonts as the original MemeChat
2. **Enhanced UI/UX**: Improved group management and message display
3. **Better State Management**: Cleaner state organization with proper cleanup
4. **Real-time Listeners**: Proper Firebase listeners with cleanup
5. **Timestamp Display**: Better timestamp formatting with clock icons
6. **Default Group**: Automatic default "General Chat" group for all users
7. **Reserved Names**: Prevention of creating groups with reserved names