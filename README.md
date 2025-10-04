# EduVerse - AI-Powered Adaptive Learning Ecosystem

Welcome to EduVerse, a revolutionary learning platform that transforms education through artificial intelligence and adaptive learning technologies. This README will guide you through everything you need to know about the project.

## 🌟 What is EduVerse?

EduVerse is an innovative educational platform designed to provide personalized, adaptive learning experiences for students, teachers, and working professionals. Using cutting-edge AI technologies, EduVerse creates customized learning paths that adapt to each user's unique learning style, pace, and preferences.

### Key Features

1. **Adaptive Knowledge Map**: A dynamic, visual representation of skills and concepts that adapts as you learn
2. **AI Mentor Avatar**: Your personal AI tutor with a distinct personality that guides your learning journey
3. **Emotion & Focus-Adaptive Learning**: Real-time adjustment of content based on your engagement and focus levels
4. **Micro-Learning Bursts**: Bite-sized, highly engaging learning sessions optimized for retention
5. **Real-World Context Generator**: Learning scenarios connected to practical, real-world applications
6. **Peer Learning**: Collaborative learning experiences with fellow students
7. **Teacher Dashboard 2.0**: Advanced analytics and AI-powered insights for educators
8. **Gamified Learning Economy**: Points, badges, and rewards system to motivate learning

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd eduverse-clean
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Environment Configuration

To enable full functionality, you need to configure environment variables:

1. Copy the [.env.example](file:///C:/Users/bordo/Downloads/hackwavw_hackathon/eduverse-clean/.env.example) file to [.env](file:///C:/Users/bordo/Downloads/hackwavw_hackathon/eduverse-clean/.env):
   ```bash
   cp .env.example .env
   ```

2. Update the [.env](file:///C:/Users/bordo/Downloads/hackwavw_hackathon/eduverse-clean/.env) file with your actual API keys:
   ```
   # Firebase Configuration (optional for full auth functionality)
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Gemini API Configuration (required for "Learn Anything" feature)
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

### Firebase Configuration

To enable full authentication functionality:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Email/Password authentication in Firebase Authentication settings
3. Update the [.env](file:///C:/Users/bordo/Downloads/hackwavw_hackathon/eduverse-clean/.env) file with your Firebase project credentials:
   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Gemini API Configuration

To enable the "Learn Anything" feature with real AI explanations:

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Update the [.env](file:///C:/Users/bordo/Downloads/hackwavw_hackathon/eduverse-clean/.env) file with your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

## 🎯 How to Use EduVerse

### 1. User Registration & Authentication

When you first visit EduVerse, you'll be asked to select your role:
- **Student**: For learners seeking to acquire new skills
- **Teacher**: For educators creating content and tracking student progress
- **Working Professional**: For career advancement and upskilling

After selecting your role, you can either sign in with an existing account or create a new one.

### 2. Dashboard Overview

Upon logging in, you'll land on your personalized dashboard which displays:
- Your current learning progress
- Points and level achievements
- Quick access to learning activities
- Recent achievements and badges

#### Student Dashboard Features

The student dashboard includes 6 key cards/containers:

1. **Learn Anything**: AI-powered concept explanations with 3 difficulty levels (beginner, intermediate, advanced) and related learning sources
2. **Learn Through Videos**: Educational video content tailored to your learning path
3. **Learn Through Reels**: Quick learning snippets in engaging short videos
4. **AI Friend Chatbot**: Personal AI learning companion ready to help with any questions
5. **Group Chat**: Collaborate and learn with your fellow students
6. **Smart Quiz Generator**: AI-powered quizzes from any topic or PDF content

Each card links to a dedicated page with specialized functionality for that learning activity.

### 3. Adaptive Knowledge Map

Navigate to the Knowledge Map to visualize your learning journey. The map shows:
- Skills you've mastered (completed)
- Skills available for learning (unlocked)
- Skills yet to be unlocked (locked)
- Progress percentages for each skill area

### 4. AI Tutor Interactions

The AI Tutor provides personalized assistance through:
- Interactive chat conversations
- Adaptive questioning based on your knowledge level
- Real-time feedback and explanations
- Suggested learning paths

### 5. Progress Tracking

The Progress section offers detailed insights into:
- Your learning history
- Skill mastery levels
- Time spent on different subjects
- Achievement milestones

### 6. Teacher Dashboard (For Educators)

Educators have access to advanced features:
- Student progress analytics
- AI-powered learning insights
- Content creation tools
- Class management capabilities

## 🛠️ Technical Architecture

### Frontend Stack

- **React 18** with TypeScript for robust component development
- **Vite** for fast development and building
- **Custom CSS** for styling (no external CSS frameworks)
- **React Router** for navigation
- **Context API** for state management

### Authentication

- **Firebase Authentication** for secure user management
- Email/password authentication flow
- Session persistence across browser sessions
- Role-based access control (Student/Teacher/Professional)

### AI Integration

- **Gemini API** for the "Learn Anything" feature
- Natural language explanations of any concept
- Three difficulty levels (beginner, intermediate, advanced)
- Related learning resources and sources

### Key Components

1. **User Authentication System**
   - User type selection (Student/Teacher/Professional)
   - Secure login/signup with form validation
   - Session management and logout functionality

2. **Learning Context Management**
   - Skill tree representation
   - Learning progress tracking
   - Adaptive content delivery

3. **User Context Management**
   - User profile and preferences
   - Points and badge system
   - Role-specific features

4. **UI Components**
   - Responsive navigation bar
   - Interactive dashboard
   - Knowledge map visualization
   - AI tutor interface

### Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/            # React context providers
├── pages/               # Page components
│   ├── student/         # Student-specific pages
│   │   ├── cards/       # Student dashboard card pages
│   │   └── ...          # Other student pages
│   ├── teacher/         # Teacher-specific pages
│   └── professional/    # Professional-specific pages
├── services/            # External service integrations
├── utils/               # Utility functions
├── simple.css           # Custom styling
└── App.tsx              # Main application component
```

## 🎨 UI/UX Design Philosophy

EduVerse follows a user-centered design approach with:

### Visual Design
- Clean, modern interface with gradient backgrounds
- Consistent color scheme using indigo and purple accents
- Ample whitespace for readability
- Responsive layout for all device sizes

### User Experience
- Intuitive navigation with clear visual hierarchy
- Immediate feedback for user actions
- Smooth animations and transitions
- Accessible design principles

### Authentication Flow
1. **User Type Selection**: Clear role identification
2. **Login/Signup**: Streamlined forms with validation
3. **Protected Routes**: Secure access to application features
4. **Session Management**: Persistent login state

## 🔧 Development Workflow

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Create a production build
- `npm run preview`: Preview the production build locally

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

### Custom Styling

EduVerse uses a custom CSS approach without external frameworks:
- Consistent design system
- Reusable CSS classes
- Responsive design patterns
- Component-specific styling

## 🤝 Contributing

We welcome contributions to EduVerse! Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

### Areas for Improvement

- Additional AI features
- More learning content
- Enhanced analytics
- Mobile app development
- Accessibility improvements

## 📚 Future Enhancements

Planned features and improvements:

1. **Advanced AI Integration**
   - Natural language processing for more conversational AI
   - Machine learning for better content recommendations
   - Voice interaction capabilities

2. **Expanded Content Library**
   - More subjects and skill areas
   - Interactive simulations
   - Video content integration

3. **Social Learning Features**
   - Study groups and collaboration tools
   - Leaderboards and competitions
   - Mentor matching system

4. **Analytics and Insights**
   - Deeper learning analytics
   - Predictive performance modeling
   - Personalized study recommendations

## 📞 Support

For questions, issues, or feedback, please:

1. Check the existing issues in the repository
2. Create a new issue if your problem isn't addressed
3. Contact the development team through the repository

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///C:/Users/bordo/Downloads/hackwavw_hackathon/eduverse-clean/LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped build EduVerse
- Inspired by the need for more personalized and adaptive learning experiences
- Built with modern web technologies for optimal performance

---

*EduVerse - Transforming Education Through AI and Adaptive Learning*