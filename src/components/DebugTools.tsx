import React, { useState } from 'react';
import { debugErrors, copyErrorToClipboard } from '@/lib/debug';
import { Check, Copy, AlertCircle, Bug } from 'lucide-react';

interface ErrorButtonProps {
  errorKey: keyof typeof debugErrors;
  label: string;
}

export const DebugTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedError, setCopiedError] = useState<string | null>(null);

  const handleCopyError = (errorKey: keyof typeof debugErrors) => {
    copyErrorToClipboard(errorKey);
    setCopiedError(errorKey);
    setTimeout(() => setCopiedError(null), 2000);
  };

  const errorButtons: ErrorButtonProps[] = [
    { errorKey: 'toastViewportError', label: 'Erro de ToastViewport' },
    { errorKey: 'circularDependencyError', label: 'Erro de Dependência Circular' },
    { errorKey: 'radixUIPortalError', label: 'Erro de Portal UI' },
    { errorKey: 'supabaseUuidError', label: 'Erro de UUID do Supabase' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botão de toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
        title="Ferramentas de Debug"
      >
        <Bug size={20} />
      </button>

      {/* Painel de ferramentas */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-gray-800 rounded-lg shadow-xl p-4 text-white">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <AlertCircle size={18} className="mr-2 text-yellow-400" />
            Ferramentas de Debug
          </h3>
          
          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-2">Clique para copiar o erro:</p>
            
            {errorButtons.map((btn) => (
              <button
                key={btn.errorKey}
                onClick={() => handleCopyError(btn.errorKey)}
                className="w-full flex items-center justify-between p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                <span>{btn.label}</span>
                {copiedError === btn.errorKey ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )}
              </button>
            ))}
            
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Estas ferramentas são para desenvolvimento apenas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugTools; 