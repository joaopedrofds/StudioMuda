import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = ({ loading, size = 50, color = "#4ade80", message = "Carregando..." }) => {
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-xs">
        <ClipLoader color={color} size={size} />
        <p className="mt-4 text-gray-700 font-medium text-center">{message}</p>
        <p className="mt-2 text-gray-500 text-sm text-center">
          Por favor, aguarde enquanto processamos sua solicitação
        </p>
      </div>
    </div>
  );
};

export default Loading;