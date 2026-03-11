import React, { useState, useEffect } from 'react';
import MachineCard from './machineCard';
import Alerts from './alerts';
import './styles.css';

const Dashboard = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMachines = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/machines');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMachines(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      
      setMachines([
        { id: 'M-1', name: 'Conveyor Belt A', temperature: 70, vibration: 4, pressure: 100, status: 'Healthy', failure_risk: 0 },
        { id: 'M-2', name: 'Robotic Arm B', temperature: 90, vibration: 9, pressure: 110, status: 'Needs Maintenance', failure_risk: 1 },
        { id: 'M-3', name: 'Cooling Pump C', temperature: 65, vibration: 2, pressure: 85, status: 'Healthy', failure_risk: 0 }
      ]);
    }
  };

  useEffect(() => {
    fetchMachines();
    const interval = setInterval(fetchMachines, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <header className="dashboard-header">
          <div>
            <h1 className="title">
              Predictive Maintenance Dashboard
            </h1>
            <p className="subtitle">Real-time sensor monitoring & AI failure prediction</p>
          </div>
          {loading && <span style={{ color: '#94a3b8' }}>Updating...</span>}
        </header>

        {error && (
          <div style={{ 
            backgroundColor: '#334155', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            marginBottom: '24px', 
            fontSize: '14px',
            color: '#cbd5e1',
            borderLeft: '4px solid #fbbf24'
          }}>
            <strong>Notice:</strong> Could not connect to the backend server ({error}). Showing mock UI data. Start the Flask server on port 5000 to see real capabilities.
          </div>
        )}

        <Alerts machines={machines} />
        
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#e2e8f0' }}>Monitored Equipment</h2>
        <div className="machines-grid">
          {machines.map(machine => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
