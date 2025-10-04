# Firebase Chat Architecture

## Component Diagram

```mermaid
graph TD
    A[EduVerseFirebaseChat Component] --> B[Firebase Authentication]
    A --> C[Firebase Realtime Database]
    B --> D[Anonymous Sign In]
    C --> E[Messages Node]
    E --> F[Message 1]
    E --> G[Message 2]
    E --> H[Message N]
    
    A --> I[User Interface]
    I --> J[Join Screen]
    I --> K[Chat Interface]
    I --> L[Message Input]
    I --> M[Message Display]
    
    K --> N[Message List]
    K --> O[Scroll Container]
```

## Data Flow

1. **User Authentication**
   ```mermaid
   sequenceDiagram
   EduVerseFirebaseChat->>Firebase Auth: signInAnonymously()
   Firebase Auth->>EduVerseFirebaseChat: User Credential
   EduVerseFirebaseChat->>localStorage: Save Display Name
   ```

2. **Message Sending**
   ```mermaid
   sequenceDiagram
   User->>EduVerseFirebaseChat: Type Message
   EduVerseFirebaseChat->>Firebase DB: push(message)
   Firebase DB->>All Clients: onValue trigger
   All Clients->>UI: Update Message List
   ```

3. **Message Receiving**
   ```mermaid
   sequenceDiagram
   Firebase DB->>EduVerseFirebaseChat: onValue(data)
   EduVerseFirebaseChat->>UI: Render Messages
   UI->>User: Display Messages
   ```

## Security Model

```mermaid
graph LR
    A[Unauthenticated User] -- Cannot --> B[Read Messages]
    A -- Cannot --> C[Write Messages]
    D[Authenticated User] -- Can --> B
    D -- Can --> C
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> Initializing
    Initializing --> Authenticated: signInAnonymously success
    Initializing --> Error: signInAnonymously failed
    Authenticated --> JoinScreen: No saved name
    Authenticated --> ChatScreen: Has saved name
    JoinScreen --> ChatScreen: Name submitted
    ChatScreen --> Listening: Component mounted
    Listening --> Displaying: Messages received
    Displaying --> Listening: New messages
    ChatScreen --> [*]: User logout
```