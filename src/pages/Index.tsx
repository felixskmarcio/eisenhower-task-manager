
import React from 'react';
import Matrix from '@/components/Matrix';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Eisenhower Task Manager
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Organize and prioritize your tasks efficiently using the Eisenhower Matrix method.
          </p>
        </div>
        <Matrix />
      </div>
    </div>
  );
};

export default Index;
