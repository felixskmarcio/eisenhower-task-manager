
import React from 'react';
import Matrix from '@/components/Matrix';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eisenhower Task Manager
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize and prioritize your tasks efficiently using the Eisenhower Matrix method.
          </p>
        </div>
        <Matrix />
      </div>
    </div>
  );
};

export default Index;
