import React from 'react';
import GoogleCalendarSync from '../components/GoogleCalendarSync/GoogleCalendarSync';

function Dashboard() {
  const tasks = []; // This should be your actual tasks data
  
  return (
    <div className="dashboard">
      
      <GoogleCalendarSync tasks={tasks} />
    </div>
  );
}

export default Dashboard;
