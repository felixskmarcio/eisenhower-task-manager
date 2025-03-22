import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface ErrorDisplayProps {
  title: string;
  message: string;
  details?: string;
  onClose?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  title, 
  message, 
  details,
  onClose 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = details ? `${message}\n\n${details}` : message;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar o erro:', err);
      });
  };

  return (
    <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 mb-4 relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{title}</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <p className="text-white mb-3">{message}</p>
      
      {details && (
        <div className="bg-red-600 p-3 rounded text-sm mb-3 overflow-auto max-h-32">
          <pre className="whitespace-pre-wrap font-mono text-xs">{details}</pre>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="flex items-center bg-white text-red-600 hover:bg-gray-100 rounded px-3 py-1 text-sm transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-1" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1" />
              <span>Copiar erro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay; 