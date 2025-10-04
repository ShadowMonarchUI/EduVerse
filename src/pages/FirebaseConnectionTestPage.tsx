import React from 'react';
import FirebaseConnectionTest from '../components/FirebaseConnectionTest';

const FirebaseConnectionTestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Firebase Connection Test</h1>
        <p>Test page for Firebase authentication and database connectivity</p>
      </div>
      <div style={{ height: '80vh', backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
        <FirebaseConnectionTest />
      </div>
    </div>
  );
};

export default FirebaseConnectionTestPage;