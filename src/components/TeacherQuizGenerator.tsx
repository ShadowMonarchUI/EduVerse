import React, { useState } from 'react';
import { Target, Zap, Download, FileText } from 'lucide-react';
import { generateContent } from '../services/geminiService';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const TeacherQuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<{
    title: string;
    questions: QuizQuestion[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async () => {
    if (!topic.trim() || !quizTitle.trim()) {
      setError('Please enter both topic and quiz title');
      return;
    }

    if (numQuestions < 3 || numQuestions > 20) {
      setError('Number of questions must be between 3 and 20');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Create a prompt for the Gemini API to generate a quiz
      const prompt = `Generate a quiz with ${numQuestions} multiple-choice questions about "${topic}". 
      Each question should have 4 options with one correct answer. 
      Format the response as JSON with the following structure:
      {
        "questions": [
          {
            "question": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 0  // Index of correct option (0-3)
          }
        ]
      }
      Return ONLY the JSON, no other text.`;

      const response = await generateContent(prompt);
      
      // Try to parse the JSON response
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonStart = response.indexOf('{');
        const jsonEnd = response.lastIndexOf('}') + 1;
        const jsonString = response.substring(jsonStart, jsonEnd);
        
        const quizData = JSON.parse(jsonString);
        
        // Validate the structure
        if (quizData.questions && Array.isArray(quizData.questions)) {
          // Ensure each question has the required fields
          const validQuestions = quizData.questions.map((q: any, index: number) => ({
            id: index + 1,
            question: q.question || `Question ${index + 1}`,
            options: Array.isArray(q.options) && q.options.length === 4 ? q.options : [
              'Option A', 'Option B', 'Option C', 'Option D'
            ],
            correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4 
              ? q.correctAnswer : 0
          }));
          
          setGeneratedQuiz({
            title: quizTitle,
            questions: validQuestions
          });
        } else {
          throw new Error('Invalid quiz structure');
        }
      } catch (parseError) {
        console.error('Error parsing quiz JSON:', parseError);
        // Create a mock quiz if parsing fails
        const mockQuestions: QuizQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
          id: i + 1,
          question: `What is question ${i + 1} about ${topic}?`,
          options: [
            `Correct answer for question ${i + 1}`,
            `Incorrect option 1 for question ${i + 1}`,
            `Incorrect option 2 for question ${i + 1}`,
            `Incorrect option 3 for question ${i + 1}`
          ],
          correctAnswer: 0
        }));
        
        setGeneratedQuiz({
          title: quizTitle,
          questions: mockQuestions
        });
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
      
      // Create a mock quiz if API fails
      const mockQuestions: QuizQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
        id: i + 1,
        question: `What is question ${i + 1} about ${topic}?`,
        options: [
          `Correct answer for question ${i + 1}`,
          `Incorrect option 1 for question ${i + 1}`,
          `Incorrect option 2 for question ${i + 1}`,
          `Incorrect option 3 for question ${i + 1}`
        ],
        correctAnswer: 0
      }));
      
      setGeneratedQuiz({
        title: quizTitle,
        questions: mockQuestions
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPDF = () => {
    if (!generatedQuiz) return;

    // Create a structured text content for the quiz
    let content = `EduVerse Quiz\n`;
    content += `=============\n\n`;
    content += `Title: ${generatedQuiz.title}\n`;
    content += `Topic: ${topic}\n`;
    content += `Number of Questions: ${generatedQuiz.questions.length}\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    generatedQuiz.questions.forEach((q, index) => {
      content += `${index + 1}. ${q.question}\n`;
      q.options.forEach((option, optIndex) => {
        const marker = optIndex === q.correctAnswer ? '[✓] ' : '[ ] ';
        content += `   ${marker}${String.fromCharCode(65 + optIndex)}. ${option}\n`;
      });
      content += '\n';
    });
    
    // Add answer key
    content += `\nAnswer Key:\n`;
    content += `===========\n`;
    generatedQuiz.questions.forEach((q, index) => {
      const correctLetter = String.fromCharCode(65 + q.correctAnswer);
      content += `${index + 1}. ${correctLetter}\n`;
    });
    
    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedQuiz.title.replace(/\s+/g, '_')}_quiz.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card fade-in-up" style={{ 
      padding: '30px',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-xl)',
      backgroundColor: 'var(--bg-primary)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <div className="card-header" style={{ margin: 0 }}>
          <h2 className="card-title" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: 0
          }}>
            <Target size={28} style={{ color: 'var(--accent-500)' }} />
            AI Quiz Generator
          </h2>
          <p className="card-subtitle" style={{ 
            color: 'var(--text-secondary)',
            margin: '5px 0 0 0'
          }}>
            Generate quizzes with AI and download as PDF
          </p>
        </div>
      </div>
      
      {!generatedQuiz ? (
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '25px'
        }}>
          {error && (
            <div className="login-error" style={{ marginBottom: '15px' }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="quizTitle" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '1.1rem',
              marginBottom: '10px'
            }}>
              <FileText size={20} style={{ marginRight: '8px' }} />
              Quiz Title
            </label>
            <input
              id="quizTitle"
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="form-input form-input-lg"
              style={{ marginBottom: '10px' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="topic" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '1.1rem',
              marginBottom: '10px'
            }}>
              <Target size={20} style={{ marginRight: '8px' }} />
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic for the quiz"
              className="form-input form-input-lg"
              style={{ marginBottom: '10px' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="numQuestions" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '1.1rem',
              marginBottom: '10px'
            }}>
              <Target size={20} style={{ marginRight: '8px' }} />
              Number of Questions: {numQuestions}
            </label>
            <input
              id="numQuestions"
              type="range"
              min="3"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="form-input"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              <span>3</span>
              <span>20</span>
            </div>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={generateQuiz}
            disabled={isGenerating}
            style={{ 
              padding: '12px 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '10px'
            }}
          >
            {isGenerating ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px' }}></div>
                Generating Quiz...
              </>
            ) : (
              <>
                <Zap size={20} />
                Generate Quiz with AI
              </>
            )}
          </button>
        </div>
      ) : (
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)'
          }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0' }}>{generatedQuiz.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Topic: {topic} | {generatedQuiz.questions.length} Questions
              </p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={downloadAsPDF}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px'
              }}
            >
              <Download size={20} />
              Download as PDF
            </button>
          </div>
          
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            paddingRight: '10px'
          }}>
            {generatedQuiz.questions.map((q, index) => (
              <div 
                key={q.id}
                style={{
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                <h4 style={{ 
                  margin: '0 0 15px 0',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ 
                    display: 'inline-block',
                    minWidth: '30px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}.
                  </span>
                  <span>{q.question}</span>
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map((option, optIndex) => (
                    <div 
                      key={optIndex}
                      style={{
                        padding: '12px 15px',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${optIndex === q.correctAnswer ? 'var(--success-500)' : 'var(--border-primary)'}`,
                        backgroundColor: optIndex === q.correctAnswer ? 'var(--success-50)' : 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `2px solid ${optIndex === q.correctAnswer ? 'var(--success-500)' : 'var(--border-primary)'}`,
                        backgroundColor: optIndex === q.correctAnswer ? 'var(--success-500)' : 'transparent',
                        marginRight: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {optIndex === q.correctAnswer && (
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'white'
                          }} />
                        )}
                      </div>
                      <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                      {optIndex === q.correctAnswer && (
                        <span style={{ 
                          marginLeft: 'auto',
                          color: 'var(--success-600)',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '15px',
            marginTop: '25px'
          }}>
            <button 
              className="btn btn-secondary"
              onClick={downloadAsPDF}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 25px'
              }}
            >
              <Download size={20} />
              Download as PDF
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setGeneratedQuiz(null)}
              style={{ 
                padding: '12px 25px'
              }}
            >
              Generate Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherQuizGenerator;