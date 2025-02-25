"use client";

import React from 'react';

interface WorkflowStep {
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'pending' | 'not-started';
  progress?: number;
}

interface BusinessWorkflowModuleProps {
  steps: WorkflowStep[];
}

export default function BusinessWorkflowModule({ steps }: BusinessWorkflowModuleProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Ensure clicks on this module don't trigger other interactions
  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any default behavior
  };
  
  return (
    <div 
      className="pointer-events-auto bg-gray-950/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 text-white"
      onClick={handleInteraction}
      onMouseDown={handleInteraction}
      onMouseMove={handleInteraction}
    >
      <div className="text-white w-full">
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex gap-3 border border-white/10 rounded-lg p-3 bg-black/20 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-xl flex-shrink-0">
                {step.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{step.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(step.status)} text-white`}>
                    {step.status.replace('-', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-white/70 mt-1">{step.description}</p>
                
                {step.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{step.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(step.status)}`}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}