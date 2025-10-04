# Firebase Message Test

A simple test component to verify Firebase Realtime Database functionality for messaging.

## Purpose

This test component is designed to:
1. Verify that Firebase Realtime Database can read messages
2. Verify that Firebase Realtime Database can write messages
3. Test the basic message structure and data flow
4. Help diagnose issues with message sending/receiving

## Features

- Real-time message listening
- Message sending with error handling
- Status feedback for operations
- Simple UI for testing

## Usage

1. Enter a test message in the input field
2. Click "Send Test Message"
3. Observe the status message
4. Check if the message appears in the messages list

## Data Structure

The component uses the same data structure as the SimpleGroupChatFixed component:

```
simplechat_messages/
  general/
    message_id/
      id: string
      name: string
      message: string
      timestamp: number
```

## Error Handling

The component includes error handling for:
- Empty messages
- Network errors
- Permission errors
- Unknown errors

## Testing Process

1. **Message Sending Test**: Verifies that messages can be written to the database
2. **Message Receiving Test**: Verifies that messages can be read from the database
3. **Real-time Updates Test**: Verifies that new messages appear immediately
4. **Error Handling Test**: Verifies that errors are properly caught and displayed