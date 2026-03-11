import React from 'react';

const MachineCard = ({ machine }) => {
  const isHealthy = machine.status === 'Healthy';
  
  return (
    <div className="machine-card" style={{ border: `2px solid ${isHealthy ? '#4ade80' : '#f87171'}` }}>
      <h3 style={{ marginTop: 0, color: '#f3f4f6' }}>{machine.name}</h3>
      <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '-10px' }}>ID: {machine.id}</p>
      
      <div style={{ marginTop: 'auto', borderTop: '1px solid #374151', paddingTop: '12px' }}>
        <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <strong>Status: </strong> 
          <span style={{ 
            color: isHealthy ? '#000' : '#fff',
            backgroundColor: isHealthy ? '#4ade80' : '#f87171',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {machine.status}
          </span>
        </p>
        <div className="machine-stats-grid">
          <div>🌡️ Temp: <br/><strong style={{color: '#fff'}}>{machine.temperature} °C</strong></div>
          <div>📳 Vib: <br/><strong style={{color: '#fff'}}>{machine.vibration} mm/s</strong></div>
          <div>🌀 Press: <br/><strong style={{color: '#fff'}}>{machine.pressure} PSI</strong></div>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
