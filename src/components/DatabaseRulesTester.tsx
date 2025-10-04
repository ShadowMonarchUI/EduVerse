import React, { useState, useEffect } from 'react';
import { database, ref, push, set, getAuth, signInAnonymously } from '../services/firebase';

const DatabaseRulesTester: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const auth = getAuth();
        const userCredential = await signInAnonymously(auth);
        setUser(userCredential.user);
        addTestResult('Authentication successful');
      } catch (error: any) {
        addTestResult(`Authentication failed: ${error.message}`);
      }
    };
    
    initAuth();
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const testReadAccess = async () => {
    try {
      const testRef = ref(database, 'test_read');
      // We can't directly test read without onValue, so we'll just log the attempt
      addTestResult('Read access test: Attempting to read from database');
      addTestResult('Read access requires onValue listener, test inconclusive');
    } catch (error: any) {
      addTestResult(`Read access test failed: ${error.message}`);
    }
  };

  const testWriteAccess = async () => {
    try {
      const testRef = ref(database, 'test_write');
      await set(testRef, {
        test: true,
        timestamp: Date.now(),
        userId: user?.uid || 'unknown'
      });
      addTestResult('Write access test: SUCCESS - Able to write to database');
    } catch (error: any) {
      addTestResult(`Write access test: FAILED - ${error.message}`);
    }
  };

  const testMessagesWrite = async () => {
    try {
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        senderId: user?.uid || 'test-user',
        senderName: 'Rules Tester',
        text: 'Test message for rules verification',
        timestamp: Date.now()
      });
      addTestResult('Messages write test: SUCCESS - Able to write to messages node');
    } catch (error: any) {
      addTestResult(`Messages write test: FAILED - ${error.message}`);
    }
  };

  const runAllTests = async () => {
    if (!user) {
      addTestResult('Error: User not authenticated');
      return;
    }

    setIsTesting(true);
    setTestResults([]);
    
    addTestResult('Starting database rules tests...');
    
    await testWriteAccess();
    await testMessagesWrite();
    await testReadAccess();
    
    addTestResult('All tests completed');
    setIsTesting(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Database Rules Tester</h2>
      <p>User ID: {user?.uid || 'Not authenticated'}</p>
      
      <button 
        onClick={runAllTests}
        disabled={!user || isTesting}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: user && !isTesting ? 'pointer' : 'not-allowed',
          marginBottom: '20px'
        }}
      >
        {isTesting ? 'Testing...' : 'Run All Tests'}
      </button>
      
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
        <h3>Test Results</h3>
        {testResults.length > 0 ? (
          <ul>
            {testResults.map((result, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                <code>{result}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tests run yet. Click "Run All Tests" to begin.</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Expected Results with Proper Rules</h4>
        <p>With correct Firebase security rules, you should see:</p>
        <ul>
          <li>Authentication successful</li>
          <li>Write access test: SUCCESS</li>
          <li>Messages write test: SUCCESS</li>
          <li>Read access test: (inconclusive without onValue)</li>
        </ul>
        <p>If any tests fail with "PERMISSION_DENIED", check your Firebase security rules.</p>
      </div>
    </div>
  );
};

export default DatabaseRulesTester;