# MemeChatGroup Component

A group chat implementation inspired by the MemeChat example, built with modern React practices and Firebase Realtime Database.

## Features

- User name registration with localStorage persistence
- Group creation and management
- Real-time messaging within groups
- Message history with timestamps
- User logout functionality
- Responsive design with MemeChat-inspired styling

## Implementation Details

### Data Structure

The component uses Firebase Realtime Database with the following structure:

```
memechat_groups/
  group_id/
    name: string
    members: string[]
    createdAt: number

memechat_messages/
  group_id/
    message_id/
      name: string
      message: string
      timestamp: number
```

### Core Functionality

1. **User Registration**: Users enter their name to join the chat
2. **Group Management**: Users can create new groups or join existing ones
3. **Real-time Messaging**: Messages are sent and received in real-time
4. **Message History**: All messages are stored and displayed chronologically
5. **Presence Management**: Active group and user state is maintained

### Styling

The component uses the same fonts as the original MemeChat:
- **Bungee Outline** for headings
- **Varela Round** for body text

The color scheme follows the MemeChat aesthetic:
- Primary color: #D64045 (red)
- Secondary color: #1D3354 (dark blue)
- Background colors: #f0f0f0, #f9f9f9, #fff

## Usage

1. Enter your name and click "Join"
2. Create a new group or select an existing one
3. Start chatting with other users in the group
4. Logout when finished

## Component Structure

```tsx
<MemeChatGroup />
```

The component manages all its own state and Firebase connections internally.

## Dependencies

- React
- Firebase Realtime Database
- lucide-react (for icons)