import GoogleCalendarSync from '../components/GoogleCalendarSync/GoogleCalendarSync';

function Dashboard() {
  // ... seu código existente
  
  return (
    <div className="dashboard">
      {/* ... conteúdo existente */}
      
      {/* Adicione o componente de sincronização */}
      <GoogleCalendarSync tasks={tasks} />
    </div>
  );
}

export default Dashboard; 