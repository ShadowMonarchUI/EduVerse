import React, { useState, useEffect } from 'react';
import { database, ref, set, push, onValue } from '../services/firebase';

const DatabaseRulesTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [testData, setTestData] = useState<any>(null);
  const [canWrite, setCanWrite] = useState<boolean | null>(null);

  useEffect(() => {
    // Test reading data
    const testRef = ref(database, 'test');
    const unsubscribe = onValue(testRef, (snapshot) => {
      if (snapshot.exists()) {
        setTestData(snapshot.val());
      } else {
        setTestData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const testWrite = async () => {
    try {
      setStatus('Testing write permission...');
      const testRef = push(ref(database, 'test'));
      const testData = {
        message: 'Test write at ' + new Date().toISOString(),
        timestamp: Date.now()
      };
      
      await set(testRef, testData);
      setStatus('Write successful!');
      setCanWrite(true);
    } catch (error: any) {
      console.error('Write test failed:', error);
      setStatus(`Write failed: ${error.message || 'Unknown error'}`);
      setCanWrite(false);
    }
  };

  const testGroupWrite = async () => {
    try {
      setStatus('Testing group write permission...');
      const groupRef = push(ref(database, 'edumeme_groups'));
      const groupId = groupRef.key;
      
      if (groupId) {
        const groupData = {
          id: groupId,
          name: 'Test Group',
          createdAt: Date.now(),
          createdBy: 'Test User'
        };
        
        await set(groupRef, groupData);
        setStatus('Group write successful!');
        setCanWrite(true);
      } else {
        setStatus('Failed to generate group ID');
        setCanWrite(false);
      }
    } catch (error: any) {
      console.error('Group write test failed:', error);
      setStatus(`Group write failed: ${error.message || 'Unknown error'}`);
      setCanWrite(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Database Rules Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>Status:</strong> {status}
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>Can Write:</strong> {canWrite === null ? 'Unknown' : canWrite ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testWrite}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Basic Write
        </button>
        
        <button
          onClick={testGroupWrite}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Group Write
        </button>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa' }}>
        <strong>Current Test Data:</strong>
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DatabaseRulesTest;