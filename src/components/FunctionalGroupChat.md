# FunctionalGroupChat Component

## Overview
The FunctionalGroupChat component is a fully functional real-time group chat application that uses Firebase Realtime Database for messaging. It provides a complete chat experience with group creation, joining, messaging, and user presence indicators.

## Features
- Create and join study groups
- Real-time messaging with other group members
- User presence indicators (online/offline status)
- Group management (create, join, leave groups)
- Responsive design with sidebar navigation
- Message history with timestamps
- Online member counters
- Group menu with leave option

## Component Structure
1. **Groups Sidebar** - Left panel showing all available groups
2. **Chat Area** - Main panel displaying messages for the selected group
3. **Message Input** - Bottom panel for sending new messages
4. **Group Header** - Top bar with group info and menu

## Props
None - This is a self-contained component

## Usage
The component can be used directly in any React application that has Firebase configured. It handles all group management and messaging logic internally.

## State Management
- `currentUser` - Current user information
- `groups` - Array of available study groups from Firebase
- `activeGroup` - Currently selected group
- `messages` - Array of messages in the active group from Firebase
- `groupMembers` - Array of members in the active group with presence info
- `newMessage` - Current text in the message input field
- `newGroupName` - Current text in the group creation input field
- `showCreateGroup` - Boolean to toggle group creation form
- `showGroupMenu` - Boolean to toggle group menu

## Firebase Integration
The component uses the following Firebase services:
- **Realtime Database** - For storing groups, messages, and member presence

### Data Structure
```
groups/
  {groupId}/
    id: string
    name: string
    members: string[] // User IDs
    createdAt: number // Timestamp
    createdBy: string // User ID

messages/
  {groupId}/
    {messageId}/
      id: string
      groupId: string
      userId: string
      userName: string
      content: string
      timestamp: number // Timestamp

groupMembers/
  {groupId}/
    {userId}/
      userId: string
      userName: string
      lastSeen: number
      isOnline: boolean
```

## Key Functions
- `handleSendMessage()` - Sends a new message to the active group using Firebase
- `handleCreateGroup()` - Creates a new study group in Firebase
- `handleJoinGroup()` - Joins an existing group in Firebase
- `handleLeaveGroup()` - Leaves the current group
- `formatTime()` - Formats timestamps for messages
- `getOnlineMembersCount()` - Returns count of online members
- `isUserOnline()` - Checks if a user is online

## Firebase Operations
- **Writing Data**: Uses `set` and `push` methods to write data
- **Reading Data**: Uses `onValue` method to listen for real-time updates
- **Updating Data**: Uses `update` method to modify specific fields
- **Deleting Data**: Uses `remove` method to delete data

## Styling
The component uses CSS-in-JS styling with the application's design system variables like `var(--primary-500)` for consistent theming.

## Error Handling
- Catches and logs errors for all Firebase operations
- Gracefully handles cases where Firebase is unavailable

## Future Enhancements
- User authentication integration
- User avatars and profile management
- File sharing capabilities
- Group settings and moderation tools
- Notification system for new messages
- Search functionality for messages and groups
- Message reactions and threading
- Typing indicators
- Message editing/deletion
- Rich text formatting
- Emoji picker
- Message search
- Group invites
- Admin/moderator roles