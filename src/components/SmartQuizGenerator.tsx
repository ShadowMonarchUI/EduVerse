import React, { useState, useRef } from 'react';
import { Search, FileText, Play, Plus, Trash2, Upload, Loader, BookOpen, Target, Zap, Award, Download, Check, X } from 'lucide-react';
import { generateContent } from '../services/geminiService';
import { useUser } from '../contexts/UserContext';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizTopic {
  id: string;
  name: string;
  content: string;
  source: 'search' | 'pdf';
  createdAt: Date;
}

const SmartQuizGenerator: React.FC = () => {
  // State for user input
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  
  // State for file upload
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState('');
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  
  // State for quiz generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for quiz taking
  const [userAnswers, setUserAnswers] = useState<{[key: string]: number}>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State for saved topics
  const [savedTopics, setSavedTopics] = useState<QuizTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  
  // User context for points
  const { user, updatePoints } = useUser();
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    setPdfFile(file);
    setIsProcessingPdf(true);
    setError(null);
    
    try {
      // In a real implementation, we would use a PDF parsing library like pdfjs-dist
      // For now, we'll simulate PDF content extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate extracted content from PDF
      const mockContent = `This is simulated content extracted from the PDF file: ${file.name}. 
In a real implementation, this would contain the actual text content from the PDF 
which would then be used to generate quizzes based on the material.`;
      
      setPdfContent(mockContent);
      
      // Save the topic
      const newTopic: QuizTopic = {
        id: Date.now().toString(),
        name: file.name,
        content: mockContent,
        source: 'pdf',
        createdAt: new Date()
      };
      
      setSavedTopics(prev => [...prev, newTopic]);
      setSelectedTopic(newTopic);
      setSuccess('PDF processed successfully! You can now generate a quiz based on this content.');
    } catch (err) {
      setError('Failed to process PDF file. Please try again.');
      console.error('Error processing PDF:', err);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Handle search for topics
  const handleSearch = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to search for');
      return;
    }
    
    // Check if Gemini API key is configured
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      setError('Gemini API key not configured. Using sample questions.');
    }
    
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    setQuizQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    
    try {
      // Save the topic
      const newTopic: QuizTopic = {
        id: Date.now().toString(),
        name: topic,
        content: `Content related to "${topic}" that would be used to generate quiz questions.`,
        source: 'search',
        createdAt: new Date()
      };
      
      setSavedTopics(prev => [...prev, newTopic]);
      setSelectedTopic(newTopic);
      
      // Generate quiz questions using Gemini API
      const prompt = `You are an expert quiz generator. Create exactly ${numQuestions} multiple choice questions about "${topic}" at ${difficulty} level.
Each question must be unique and cover different aspects of the topic.
Format your response as a valid JSON array with this exact structure:
[
  {
    "question": "The question text here",
    "options": ["First option", "Second option", "Third option", "Fourth option"],
    "correctAnswer": 0,
    "explanation": "Explanation of why the correct answer is right"
  }
]
Important rules:
- Generate exactly ${numQuestions} questions
- Each question must have exactly 4 options
- correctAnswer must be 0, 1, 2, or 3 (the index of the correct option)
- All fields are required
- Return ONLY the JSON array, no other text
- Make sure it's valid JSON that can be parsed directly

Questions about "${topic}":`;

      const response = await generateContent(prompt);
      
      // Try to parse the response as JSON
      try {
        // Clean the response to extract only JSON
        let cleanResponse = response.trim();
        
        // Remove any markdown code block markers
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.substring(7);
        }
        if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.substring(3);
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.substring(0, cleanResponse.length - 3);
        }
        
        // Find the first [ and last ] to extract JSON array
        const firstBracket = cleanResponse.indexOf('[');
        const lastBracket = cleanResponse.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
          cleanResponse = cleanResponse.substring(firstBracket, lastBracket + 1);
        }
        
        const questions = JSON.parse(cleanResponse);
        
        // Validate the structure
        if (Array.isArray(questions) && questions.length > 0) {
          // Ensure we have exactly the requested number of questions
          let validatedQuestions = questions.slice(0, numQuestions);
          
          // Validate each question has required fields
          validatedQuestions = validatedQuestions.map((q: any, index: number) => {
            // Ensure all required fields exist
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
                typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3 ||
                !q.explanation) {
              // If invalid structure, create a fallback question
              return {
                id: `q-${Date.now()}-${index}`,
                question: `What is an important aspect of ${topic}? (Question ${index + 1})`,
                options: [
                  `Key concept A about ${topic}`,
                  `Key concept B about ${topic}`,
                  `Key concept C about ${topic}`,
                  `Key concept D about ${topic}`
                ],
                correctAnswer: index % 4,
                explanation: `This question covers an important aspect of ${topic}.`
              };
            }
            
            return {
              ...q,
              id: `q-${Date.now()}-${index}`
            };
          });
          
          setQuizQuestions(validatedQuestions);
          setSuccess(`Quiz generated successfully with ${validatedQuestions.length} questions!`);
        } else {
          throw new Error('Invalid quiz format');
        }
      } catch (parseError) {
        // If JSON parsing fails, create mock questions
        console.error('Error parsing quiz response:', parseError);
        console.error('Raw response:', response);
        const mockQuestions: QuizQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
          id: `q-${Date.now()}-${i}`,
          question: `What is an important aspect of ${topic} in question ${i + 1}?`,
          options: [
            `Key concept ${i + 1}A related to ${topic}`,
            `Key concept ${i + 1}B related to ${topic}`,
            `Key concept ${i + 1}C related to ${topic}`,
            `Key concept ${i + 1}D related to ${topic}`
          ],
          correctAnswer: i % 4,
          explanation: `This is a sample explanation for question ${i + 1} about ${topic}. In a real implementation, this would provide detailed information about the correct answer.`
        }));
        
        setQuizQuestions(mockQuestions);
        setSuccess(`Quiz generated with sample questions. In a production environment with a valid Gemini API key, this would contain real questions about "${topic}".`);
      }
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Error generating quiz:', err);
      
      // Fallback to mock questions even if API fails
      const mockQuestions: QuizQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
        id: `q-${Date.now()}-${i}`,
        question: `What is an important aspect of ${topic} in question ${i + 1}?`,
        options: [
          `Key concept ${i + 1}A related to ${topic}`,
          `Key concept ${i + 1}B related to ${topic}`,
          `Key concept ${i + 1}C related to ${topic}`,
          `Key concept ${i + 1}D related to ${topic}`
        ],
        correctAnswer: i % 4,
        explanation: `This is a sample explanation for question ${i + 1} about ${topic}. In a real implementation, this would provide detailed information about the correct answer.`
      }));
      
      setQuizQuestions(mockQuestions);
      setSuccess(`Quiz generated with sample questions due to API error.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating && topic.trim()) {
      handleSearch();
    }
  };

  // Reset the quiz generator
  const resetQuiz = () => {
    setQuizQuestions([]);
    setTopic('');
    setPdfFile(null);
    setPdfContent('');
    setSelectedTopic(null);
    setError(null);
    setSuccess(null);
    setUserAnswers({});
    setSubmitted(false);
  };

  // Delete a saved topic
  const deleteTopic = (id: string) => {
    setSavedTopics(prev => prev.filter(topic => topic.id !== id));
    if (selectedTopic?.id === id) {
      setSelectedTopic(null);
      setQuizQuestions([]);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    
    // Check if answer is correct and give immediate feedback
    const question = quizQuestions.find(q => q.id === questionId);
    if (question && optionIndex === question.correctAnswer) {
      // Correct answer - give points immediately
      if (updatePoints) {
        updatePoints(10);
      }
      setSuccess('Correct! +10 points');
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  // Submit the quiz
  const handleSubmitQuiz = () => {
    setSubmitted(true);
    
    // Calculate score
    let correctAnswers = 0;
    quizQuestions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    // Calculate points (already awarded per question, so just show total)
    const pointsEarned = correctAnswers * 10;
    
    // Award additional experience points for completing the quiz
    if (updatePoints) {
      updatePoints(25); // Bonus 25 XP for completing the quiz
    }
    
    setSuccess(`Quiz completed! You got ${correctAnswers} out of ${quizQuestions.length} correct.`);
  };

  // Calculate score function
  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Get difficulty label
  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return level;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'var(--success-500)';
      case 'intermediate': return 'var(--warning-500)';
      case 'advanced': return 'var(--error-500)';
      default: return 'var(--primary-500)';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-primary)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-700) 100%)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              marginRight: 'var(--space-4)'
            }}>
              <Target size={24} />
            </div>
            <div>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'white',
                margin: 0
              }}>Smart Quiz Generator</h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 'var(--text-sm)',
                margin: 'var(--space-1) 0 0 0'
              }}>AI-powered quizzes from any topic or PDF</p>
            </div>
          </div>
          <button 
            onClick={resetQuiz}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'var(--font-medium)',
              transition: 'all var(--transition-fast)'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden'
      }}>
        {/* Sidebar for saved topics */}
        <div style={{
          width: '300px',
          borderRight: '1px solid var(--border-primary)',
          background: 'linear-gradient(180deg, var(--primary-50) 0%, var(--secondary-50) 100%)',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <BookOpen size={20} style={{ 
              marginRight: 'var(--space-2)', 
              color: 'var(--primary-500)' 
            }} />
            Saved Topics
          </h3>
          
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            marginBottom: 'var(--space-4)'
          }}>
            {savedTopics.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {savedTopics.map((topicItem) => (
                  <div
                    key={topicItem.id}
                    onClick={() => setSelectedTopic(topicItem)}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-normal)',
                      background: selectedTopic?.id === topicItem.id
                        ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)'
                        : 'var(--bg-card)',
                      color: selectedTopic?.id === topicItem.id ? 'white' : 'var(--text-primary)',
                      boxShadow: selectedTopic?.id === topicItem.id ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                      border: selectedTopic?.id === topicItem.id 
                        ? 'none' 
                        : '1px solid var(--border-primary)',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <h4 style={{
                        fontWeight: 'var(--font-semibold)',
                        color: selectedTopic?.id === topicItem.id ? 'white' : 'var(--text-primary)',
                        fontSize: 'var(--text-base)',
                        margin: 0,
                        flex: 1
                      }}>
                        {topicItem.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTopic(topicItem.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: selectedTopic?.id === topicItem.id ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-tertiary)',
                          cursor: 'pointer',
                          padding: 'var(--space-1)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 'var(--text-xs)',
                      color: selectedTopic?.id === topicItem.id 
                        ? 'rgba(255, 255, 255, 0.8)' 
                        : 'var(--text-secondary)'
                    }}>
                      {topicItem.source === 'pdf' ? (
                        <FileText size={14} style={{ marginRight: 'var(--space-1)' }} />
                      ) : (
                        <Search size={14} style={{ marginRight: 'var(--space-1)' }} />
                      )}
                      <span>
                        {topicItem.source === 'pdf' ? 'PDF Content' : 'Search Topic'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-8) var(--space-4)',
                color: 'var(--text-secondary)'
              }}>
                <BookOpen size={48} style={{ 
                  margin: '0 auto var(--space-4)', 
                  color: 'var(--primary-300)' 
                }} />
                <p>No saved topics yet</p>
                <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                  Search for topics or upload PDFs to get started
                </p>
              </div>
            )}
          </div>
          
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-3) 0'
            }}>
              Your Progress
            </h4>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)'
            }}>
              <span>Points:</span>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>{user?.points || 0}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-2)'
            }}>
              <span>Level:</span>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>{user?.level || 1}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-2)'
            }}>
              <span>Quizzes:</span>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>{savedTopics.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Input Section */}
          <div style={{
            padding: 'var(--space-6)',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-card)'
          }}>
            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-5)'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={20} style={{
                  position: 'absolute',
                  left: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }} />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a topic to generate a quiz..."
                  style={{
                    width: '100%',
                    paddingLeft: 'calc(var(--space-4) + var(--space-6))',
                    paddingRight: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-base)',
                    transition: 'all var(--transition-fast)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isGenerating || !topic.trim()}
                style={{
                  padding: 'var(--space-4) var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-base)',
                  transition: 'all var(--transition-normal)',
                  background: topic.trim() 
                    ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)' 
                    : 'var(--neutral-200)',
                  color: topic.trim() ? 'white' : 'var(--neutral-500)',
                  cursor: topic.trim() ? 'pointer' : 'not-allowed',
                  border: 'none',
                  boxShadow: topic.trim() ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader size={20} className="loading-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <label style={{
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)'
                }}>
                  Questions:
                </label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)'
                  }}
                >
                  {[3, 5, 10, 15, 20].map(num => (
                    <option key={num} value={num}>{num} questions</option>
                  ))}
                </select>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                <label style={{
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)'
                }}>
                  Difficulty:
                </label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        border: '1px solid',
                        borderColor: difficulty === level 
                          ? getDifficultyColor(level) 
                          : 'var(--border-primary)',
                        background: difficulty === level 
                          ? `${getDifficultyColor(level)}15` 
                          : 'var(--bg-card)',
                        color: difficulty === level 
                          ? getDifficultyColor(level) 
                          : 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {getDifficultyLabel(level)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ 
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingPdf}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 'var(--font-medium)',
                    fontSize: 'var(--text-sm)',
                    transition: 'all var(--transition-normal)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}
                >
                  {isProcessingPdf ? (
                    <>
                      <Loader size={16} className="loading-spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-6)'
          }}>
            {/* Error Message */}
            {error && (
              <div style={{
                padding: 'var(--space-4)',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'var(--space-6)',
                color: '#dc2626'
              }}>
                <Target style={{ marginRight: 'var(--space-3)' }} size={20} />
                <span>{error}</span>
              </div>
            )}
            
            {/* Success Message */}
            {success && !quizQuestions.length && (
              <div style={{
                padding: 'var(--space-4)',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'var(--space-6)',
                color: '#16a34a'
              }}>
                <Target style={{ marginRight: 'var(--space-3)' }} size={20} />
                <span>{success}</span>
              </div>
            )}
            
            {/* Quiz Questions */}
            {quizQuestions.length > 0 ? (
              <div>
                {/* Quiz Header with Progress */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-6)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    Quiz: {selectedTopic?.name || topic}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-2) var(--space-4)',
                    background: `${getDifficultyColor(difficulty)}15`,
                    borderRadius: 'var(--radius-full)',
                    color: getDifficultyColor(difficulty),
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)'
                  }}>
                    <Target size={16} />
                    {getDifficultyLabel(difficulty)} • {quizQuestions.length} questions
                  </div>
                </div>
                
                {/* All Questions Display */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-6)' 
                }}>
                  {quizQuestions.map((question, index) => {
                    const userAnswer = userAnswers[question.id];
                    const isAnswered = userAnswer !== undefined;
                    const isCorrect = isAnswered && userAnswer === question.correctAnswer;
                    
                    return (
                      <div 
                        key={question.id}
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-xl)',
                          padding: 'var(--space-6)',
                          border: '1px solid var(--border-primary)',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: 'var(--space-4)'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--primary-500)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'var(--font-bold)',
                            fontSize: 'var(--text-sm)',
                            marginRight: 'var(--space-3)',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </div>
                          <h4 style={{
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--text-primary)',
                            margin: 0,
                            flex: 1
                          }}>
                            {question.question}
                          </h4>
                        </div>
                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 'var(--space-3)',
                          marginBottom: 'var(--space-4)'
                        }}>
                          {question.options.map((option, optionIndex) => {
                            // Skip if option is undefined or null
                            if (!option) return null;
                            
                            const isSelected = userAnswer === optionIndex;
                            const isCorrectOption = optionIndex === question.correctAnswer;
                            const showResult = isAnswered;
                            
                            let optionStyle = {
                              padding: 'var(--space-4)',
                              borderRadius: 'var(--radius-lg)',
                              border: '1px solid var(--border-primary)',
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'var(--space-3)',
                              cursor: submitted ? 'default' : 'pointer',
                              transition: 'all var(--transition-fast)'
                            };
                            
                            if (showResult) {
                              if (isCorrectOption) {
                                optionStyle = {
                                  ...optionStyle,
                                  background: 'var(--success-50)',
                                  border: '1px solid var(--success-300)',
                                  color: 'var(--success-700)'
                                };
                              } else if (isSelected && !isCorrectOption) {
                                optionStyle = {
                                  ...optionStyle,
                                  background: 'var(--error-50)',
                                  border: '1px solid var(--error-300)',
                                  color: 'var(--error-700)'
                                };
                              }
                            } else if (isSelected) {
                              optionStyle = {
                                ...optionStyle,
                                border: '1px solid var(--primary-500)',
                                background: 'var(--primary-50)'
                              };
                            }
                            
                            return (
                              <div
                                key={optionIndex}
                                onClick={() => !submitted && handleAnswerSelect(question.id, optionIndex)}
                                style={optionStyle}
                              >
                                <div style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: 'var(--radius-full)',
                                  background: isSelected 
                                    ? 'var(--primary-500)' 
                                    : 'var(--neutral-300)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'var(--font-bold)',
                                  fontSize: 'var(--text-xs)',
                                  flexShrink: 0,
                                  minWidth: '24px'
                                }}>
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <span style={{
                                  wordBreak: 'break-word',
                                  flex: 1
                                }}>
                                  {option}
                                </span>
                                {showResult && isCorrectOption && (
                                  <div style={{
                                    marginLeft: 'auto',
                                    color: 'var(--success-500)',
                                    flexShrink: 0
                                  }}>
                                    <Check size={20} />
                                  </div>
                                )}
                                {showResult && isSelected && !isCorrectOption && (
                                  <div style={{
                                    marginLeft: 'auto',
                                    color: 'var(--error-500)',
                                    flexShrink: 0
                                  }}>
                                    <X size={20} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Explanation (only shown after answering) */}
                        {isAnswered && (
                          <div style={{
                            padding: 'var(--space-4)',
                            background: isCorrect ? 'var(--success-50)' : 'var(--primary-50)',
                            borderRadius: 'var(--radius-lg)',
                            border: `1px solid ${isCorrect ? 'var(--success-200)' : 'var(--primary-200)'}`,
                            color: isCorrect ? 'var(--success-700)' : 'var(--primary-700)',
                            fontSize: 'var(--text-sm)'
                          }}>
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                        
                        {/* Immediate feedback */}
                        {isAnswered && !submitted && (
                          <div style={{
                            marginTop: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            background: isCorrect ? 'var(--success-100)' : 'var(--error-100)',
                            borderRadius: 'var(--radius-lg)',
                            border: `1px solid ${isCorrect ? 'var(--success-300)' : 'var(--error-300)'}`,
                            color: isCorrect ? 'var(--success-800)' : 'var(--error-800)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)',
                            textAlign: 'center'
                          }}>
                            {isCorrect ? '✓ Correct! +10 points' : '✗ Incorrect. Try again!'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Submit Button */}
                <div style={{
                  textAlign: 'center',
                  marginTop: 'var(--space-6)'
                }}>
                  {!submitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(userAnswers).length < quizQuestions.length}
                      style={{
                        padding: 'var(--space-4) var(--space-6)',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: 'var(--font-bold)',
                        fontSize: 'var(--text-base)',
                        transition: 'all var(--transition-normal)',
                        background: Object.keys(userAnswers).length >= quizQuestions.length
                          ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-600) 100%)'
                          : 'var(--neutral-200)',
                        color: Object.keys(userAnswers).length >= quizQuestions.length ? 'white' : 'var(--neutral-500)',
                        cursor: Object.keys(userAnswers).length >= quizQuestions.length ? 'pointer' : 'not-allowed',
                        border: 'none',
                        boxShadow: Object.keys(userAnswers).length >= quizQuestions.length 
                          ? '0 4px 15px rgba(59, 130, 246, 0.3)' 
                          : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-4) var(--space-6)',
                      background: 'var(--success-50)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--success-200)',
                      color: 'var(--success-700)',
                      fontWeight: 'var(--font-bold)'
                    }}>
                      <Check size={24} />
                      <span>Quiz Completed! You got {calculateScore()} out of {quizQuestions.length} correct. You earned {calculateScore() * 10} points!</span>
                    </div>
                  )}
                </div>
                
                {/* Final Results (only shown after submission) */}
                {submitted && (
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6)',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    marginTop: 'var(--space-6)'
                  }}>
                    <h3 style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}>
                      <Target size={24} style={{ color: 'var(--primary-500)' }} />
                      Quiz Results
                    </h3>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 'var(--space-4)',
                      marginBottom: 'var(--space-6)'
                    }}>
                      <div style={{
                        background: 'var(--primary-50)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'var(--text-3xl)',
                          fontWeight: 'var(--font-bold)',
                          color: 'var(--primary-600)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {calculateScore()}
                        </div>
                        <div style={{
                          color: 'var(--primary-700)',
                          fontSize: 'var(--text-sm)'
                        }}>
                          Correct Answers
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'var(--secondary-50)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'var(--text-3xl)',
                          fontWeight: 'var(--font-bold)',
                          color: 'var(--secondary-600)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {quizQuestions.length - calculateScore()}
                        </div>
                        <div style={{
                          color: 'var(--secondary-700)',
                          fontSize: 'var(--text-sm)'
                        }}>
                          Incorrect Answers
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'var(--success-50)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'var(--text-3xl)',
                          fontWeight: 'var(--font-bold)',
                          color: 'var(--success-600)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {calculateScore() * 10}
                        </div>
                        <div style={{
                          color: 'var(--success-700)',
                          fontSize: 'var(--text-sm)'
                        }}>
                          Points Earned
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'var(--warning-50)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'var(--text-3xl)',
                          fontWeight: 'var(--font-bold)',
                          color: 'var(--warning-600)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {quizQuestions.length > 0 ? Math.round((calculateScore() / quizQuestions.length) * 100) : 0}%
                        </div>
                        <div style={{
                          color: 'var(--warning-700)',
                          fontSize: 'var(--text-sm)'
                        }}>
                          Score
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => {
                          // In a real implementation, this would download the quiz as a PDF
                          alert('In a real implementation, this would download the quiz as a PDF file.');
                        }}
                        style={{
                          padding: 'var(--space-3) var(--space-5)',
                          borderRadius: 'var(--radius-lg)',
                          fontWeight: 'var(--font-medium)',
                          fontSize: 'var(--text-sm)',
                          transition: 'all var(--transition-normal)',
                          background: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          border: '1px solid var(--border-primary)',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)'
                        }}
                      >
                        <Download size={16} />
                        Download Results
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: 'var(--space-12) 0'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '96px',
                  height: '96px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-100)',
                  color: 'var(--primary-500)',
                  marginBottom: 'var(--space-6)'
                }}>
                  <Target size={48} />
                </div>
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-3)'
                }}>Generate Your First Quiz</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  maxWidth: '500px',
                  marginBottom: 'var(--space-6)'
                }}>
                  Enter a topic above or upload a PDF to generate an AI-powered quiz. 
                  Customize the number of questions and difficulty level to suit your needs.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 'var(--space-6)',
                  maxWidth: '700px',
                  width: '100%'
                }}>
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6)',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-4)'
                    }}>
                      <Search size={24} />
                    </div>
                    <h4 style={{
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-3)'
                    }}>Search Topics</h4>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      Enter any subject to generate a quiz with AI-powered questions
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6)',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--secondary-100)',
                      color: 'var(--secondary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-4)'
                    }}>
                      <FileText size={24} />
                    </div>
                    <h4 style={{
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-3)'
                    }}>Upload PDFs</h4>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      Upload educational materials to create quizzes from your content
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6)',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--success-100)',
                      color: 'var(--success-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-4)'
                    }}>
                      <Target size={24} />
                    </div>
                    <h4 style={{
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-3)'
                    }}>Customize</h4>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      Choose question count and difficulty level for personalized learning
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SmartQuizGenerator;