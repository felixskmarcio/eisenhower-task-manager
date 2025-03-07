import React from 'react';
import Matrix from '@/components/Matrix';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Eisenhower Task Manager
          </h1>
          <p className="text-lg text-base-content max-w-2xl mx-auto">
            Organize e priorize suas tarefas de forma eficiente usando o método Eisenhower Matrix.
          </p>
          <div className="flex justify-center mt-6">
            <Link 
              to="/dashboard" 
              className="btn btn-primary"
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
