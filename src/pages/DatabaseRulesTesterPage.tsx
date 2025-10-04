import React from 'react';
import DatabaseRulesTester from '../components/DatabaseRulesTester';

const DatabaseRulesTesterPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Database Rules Tester</h1>
        <p>Test page for Firebase database security rules</p>
      </div>
      <div style={{ height: '80vh', backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
        <DatabaseRulesTester />
      </div>
    </div>
  );
};

export default DatabaseRulesTesterPage;