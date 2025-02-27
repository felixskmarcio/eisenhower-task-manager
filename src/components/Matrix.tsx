
import React from 'react';
import { Card } from '@/components/ui/card';

interface Task {
  id: string;
  title: string;
  description: string;
  important: boolean;
  urgent: boolean;
  completed: boolean;
}

export const Matrix = () => {
  const quadrants = [
    {
      title: "Do First",
      description: "Important & Urgent",
      important: true,
      urgent: true,
      bgColor: "bg-urgent-light",
      borderColor: "border-urgent",
    },
    {
      title: "Schedule",
      description: "Important & Not Urgent",
      important: true,
      urgent: false,
      bgColor: "bg-primary-light",
      borderColor: "border-primary",
    },
    {
      title: "Delegate",
      description: "Not Important & Urgent",
      important: false,
      urgent: true,
      bgColor: "bg-secondary-light/50",
      borderColor: "border-secondary",
    },
    {
      title: "Don't Do",
      description: "Not Important & Not Urgent",
      important: false,
      urgent: false,
      bgColor: "bg-gray-100",
      borderColor: "border-gray-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full max-w-7xl mx-auto animate-fade-in">
      {quadrants.map((quadrant) => (
        <Card
          key={quadrant.title}
          className={`p-4 backdrop-blur-sm border-2 ${quadrant.borderColor} ${quadrant.bgColor} transition-all duration-300 hover:shadow-lg`}
        >
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-1">{quadrant.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{quadrant.description}</p>
            <div className="flex-grow min-h-[200px] rounded-lg border-2 border-dashed border-gray-200 p-4">
              {/* Task cards will be rendered here */}
              <p className="text-center text-gray-400">Drop tasks here</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Matrix;
