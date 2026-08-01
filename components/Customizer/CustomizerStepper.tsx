"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function CustomizerStepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full py-8 px-4 bg-[#f8f9fa] flex items-center justify-center border-b border-gray-100 mb-8">
      <div className="flex items-center w-full max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={step}>
              <div 
                className="flex flex-col items-center relative z-10"
                onClick={() => isCompleted && onStepClick && onStepClick(stepNumber)}
                style={{ cursor: isCompleted ? "pointer" : "default" }}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all
                    ${isCompleted ? 'bg-[#50e3c2] text-white shadow-md' : ''}
                    ${isCurrent ? 'bg-white text-black border-2 border-black shadow-lg' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-white text-gray-400 border-2 border-gray-200' : ''}
                  `}
                >
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : stepNumber}
                </div>
                <span 
                  className={`absolute top-14 text-xs font-bold whitespace-nowrap tracking-wide
                    ${isCurrent ? 'text-black' : 'text-gray-500'}
                  `}
                >
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 h-[2px] bg-gray-200 relative overflow-hidden rounded-full mb-[24px]">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#50e3c2] transition-all duration-500 ease-in-out"
                    style={{ width: currentStep > stepNumber ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
