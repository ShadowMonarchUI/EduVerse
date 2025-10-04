# EduVerse - AI-Powered Adaptive Learning Ecosystem

## 🌟 Project Overview

EduVerse is an innovative educational platform that transforms learning through artificial intelligence and adaptive technologies. It provides personalized, engaging learning experiences for students, teachers, and professionals with features like:

- **AI-Powered Learning**: Personalized content generation using Google's Gemini API
- **Adaptive Knowledge Maps**: Dynamic skill visualization that evolves with learner progress
- **Real-time Collaboration**: Group chats and peer learning experiences
- **Gamified Education**: Points, badges, and level progression to motivate learners
- **Teacher Tools**: Advanced analytics and AI-powered content creation

## 🚀 Key Features

### For Students
- **Learn Anything**: AI-generated explanations for any concept with 3 difficulty levels
- **Video Learning**: Curated educational content
- **AI Chatbot**: 24/7 personal learning companion
- **Group Chat**: Collaborate with peers in subject-specific study groups
- **Smart Quiz Generator**: AI-powered quizzes from topics or PDFs with PDF download capability
- **Progress Tracking**: Detailed learning history and achievement tracking

### For Teachers
- **AI Course Generator**: Create complete courses on any topic using AI
- **Quiz Generator**: Generate customizable quizzes with AI and download as text files
- **Group Chat**: Communicate with students in real-time
- **Student Analytics**: Track progress and performance with detailed insights

### Technical Features
- **Role-based Access**: Separate experiences for students, teachers, and professionals
- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: System preference detection with manual toggle
- **Firebase Integration**: Real-time authentication and data synchronization
- **Gemini API**: AI-powered content generation

## 🛠️ Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- A modern web browser

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd eduverse-clean

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser and visit http://localhost:5173
```

### Environment Configuration
Create a `.env` file with your API keys:
```env
# Firebase Configuration (optional for full auth functionality)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini API Configuration (required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 🎯 How to Use

### User Roles
1. **Student**: Learn new skills with adaptive AI-powered lessons
2. **Teacher**: Create content and track student progress
3. **Professional**: Upskill with personalized learning paths

### Core Learning Activities
- **Learn Anything**: Get AI explanations for any concept
- **Learn Through Videos**: Watch educational content
- **AI Friend Chatbot**: Chat with your personal AI tutor
- **Group Chat**: Collaborate with peers
- **Smart Quiz Generator**: Create AI-powered quizzes with PDF download

## 🏗️ Technical Architecture

### Frontend Stack
- React 18 with TypeScript
- Vite for fast development
- Custom CSS styling (no external frameworks)
- React Router for navigation
- Context API for state management

### Backend & Services
- Firebase Authentication for user management
- Google Gemini API for AI-powered content
- Real-time database for chat functionality

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/            # React context providers
├── pages/               # Page components
│   ├── student/         # Student-specific pages
│   ├── teacher/         # Teacher-specific pages
│   └── professional/    # Professional-specific pages (deprecated)
├── services/            # External service integrations
└── App.tsx              # Main application component
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*EduVerse - Transforming Education Through AI and Adaptive Learning*