import React, { useState } from 'react';
import { database, ref, push, set } from '../services/firebase';

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('Test Group');
  const [userName, setUserName] = useState<string>('Test User');

  const testGroupCreation = async () => {
    try {
      setStatus('Creating group...');
      
      // Create group reference
      const newGroupRef = push(ref(database, 'edumeme_groups'));
      const groupId = newGroupRef.key;
      
      if (groupId) {
        const groupData = {
          id: groupId,
          name: groupName,
          createdAt: Date.now(),
          createdBy: userName
        };
        
        console.log('Attempting to save group data:', groupData);
        
        // Save group to database
        await set(newGroupRef, groupData);
        
        setStatus(`Group created successfully with ID: ${groupId}`);
        console.log('Group created successfully');
      } else {
        setStatus('Failed to generate group ID');
        console.error('Failed to generate group ID');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message || error}`);
      console.error('Error creating group:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Firebase Group Creation Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>User Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Group Name:</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <button
        onClick={testGroupCreation}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Group Creation
      </button>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>Status:</strong> {status}
      </div>
    </div>
  );
};

export default FirebaseTest;