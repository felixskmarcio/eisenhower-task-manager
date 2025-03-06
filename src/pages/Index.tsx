
import React from 'react';
import Matrix from '@/components/Matrix';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eisenhower Task Manager
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize e priorize suas tarefas de forma eficiente usando o método Eisenhower Matrix.
          </p>
          <div className="flex justify-center mt-6">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
        <Matrix />
      </div>
    </div>
  );
};

export default Index;
