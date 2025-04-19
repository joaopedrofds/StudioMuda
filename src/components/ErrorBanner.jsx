import React from 'react';
import { FiAlertTriangle, FiWifiOff, FiServer, FiRefreshCw } from 'react-icons/fi';

const ErrorBanner = ({ 
  isVisible, 
  errorType = 'general', 
  message, 
  onRetry 
}) => {
  if (!isVisible) return null;
  
  // Definir ícone e cor baseado no tipo de erro
  let Icon = FiAlertTriangle;
  let bgColor = 'bg-red-50';
  let textColor = 'text-red-800';
  let borderColor = 'border-red-200';
  let title = 'Erro no sistema';
  
  if (errorType === 'connection') {
    Icon = FiWifiOff;
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-800';
    borderColor = 'border-yellow-200';
    title = 'Problema de conexão';
  } else if (errorType === 'server') {
    Icon = FiServer;
    bgColor = 'bg-orange-50';
    textColor = 'text-orange-800';
    borderColor = 'border-orange-200';
    title = 'Problema no servidor';
  }
  
  return (
    <div className={`${bgColor} ${textColor} p-4 mb-4 rounded-md border ${borderColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message || 'Ocorreu um erro ao processar sua solicitação.'}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiRefreshCw className="mr-2" /> Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner;