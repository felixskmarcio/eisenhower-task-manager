import React from 'react';

function Navbar({ isSignedIn, handleAuthClick }) {
  return (
    <nav className="navbar">
      {/* ... elementos existentes */}
      
      {/* Botão de sincronização com o Google */}
      <div className="nav-calendar-sync">
        <button 
          className={`nav-cal-btn ${isSignedIn ? 'signed-in' : ''}`}
          onClick={handleAuthClick}
          title={isSignedIn ? 'Conectado ao Google Calendar' : 'Conectar ao Google Calendar'}
        >
          <svg /* ícone do calendário */></svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 