import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// Tratamento de erro global
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Erro:', {
    message: msg,
    url: url,
    lineNo: lineNo,
    columnNo: columnNo,
    error: error
  });
  return false;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
