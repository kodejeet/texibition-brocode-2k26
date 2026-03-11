import React from 'react';

const Alerts = ({ machines }) => {
  const needsMaintenance = machines.filter(m => m.failure_risk === 1);

  if (needsMaintenance.length === 0) {
    return (
      <div style={{ 
        padding: '16px', 
        backgroundColor: 'rgba(74, 222, 128, 0.1)', 
        border: '1px solid #4ade80',
        color: '#4ade80', 
        borderRadius: '8px', 
        marginBottom: '24px',
        wordBreak: 'break-word'
      }}>
        ✅ <strong>System Optimal:</strong> No critical alerts. All machines are operating within normal parameters.
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: 'rgba(248, 113, 113, 0.1)', 
      border: '1px solid #f87171',
      color: '#fca5a5', 
      borderRadius: '8px', 
      marginBottom: '24px',
      wordBreak: 'break-word'
    }}>
      <h3 style={{ marginTop: 0, color: '#f87171', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ marginRight: '8px' }}>⚠️</span> 
        Critical Alerts ({needsMaintenance.length})
      </h3>
      <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: '1.5' }}>
        {needsMaintenance.map(m => (
          <li key={m.id} style={{ marginBottom: '8px' }}>
            <strong style={{ color: 'white' }}>{m.name}</strong> is showing anomalous readings. Immediate inspection required.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
