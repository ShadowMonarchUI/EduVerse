# GroupChat Component

## Overview
The GroupChat component is a real-time collaboration feature that allows students to create study groups and chat with peers. It provides a Discord-like interface with group management and messaging capabilities, powered by Firebase Realtime Database for real-time synchronization. This enhanced version includes user presence indicators, group management features, and a more robust UI.

## Features
- Create and join study groups
- Real-time messaging with other group members using Firebase
- Group management (create, join, leave groups)
- User presence indicators (online/offline status)
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
The component is used directly in the Dashboard.tsx file as part of the Group Chat card (5th card).

## State Management
- `groups` - Array of available study groups from Firebase
- `activeGroup` - Currently selected group
- `messages` - Array of messages in the active group from Firebase
- `groupMembers` - Array of members in the active group with presence info
- `newMessage` - Current text in the message input field
- `newGroupName` - Current text in the group creation input field
- `showCreateGroup` - Boolean to toggle group creation form
- `isTyping` - Boolean to indicate typing status (future feature)
- `showGroupMenu` - Boolean to toggle group menu

## Firebase Integration
The component uses the following Firebase services:
- **Realtime Database** - For storing groups, messages, and member presence
- **Authentication** - For user identification

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
- `listenForMessages()` - Real-time listener for group messages
- `listenForGroups()` - Real-time listener for groups
- `listenForGroupMembers()` - Real-time listener for group members
- `updateUserPresence()` - Updates user online/offline status
- `formatTime()` - Formats timestamps for messages
- `getOnlineMembersCount()` - Returns count of online members
- `isUserOnline()` - Checks if a user is online
- `getLastSeen()` - Returns formatted last seen time

## Styling
The component uses CSS-in-JS styling with the application's design system variables like `var(--primary-500)` for consistent theming. It follows a two-panel layout with a sidebar for group navigation and a main chat area.

## Future Enhancements
- User avatars and profile management
- File sharing capabilities
- Group settings and moderation tools
- Notification system for new messages
- Search functionality for messages and groups
- Message reactions and threading
- Voice/video calling integration
- Typing indicators
- Message editing/deletion
- Rich text formatting
- Emoji picker
- Message search
- Group invites
- Admin/moderator roles