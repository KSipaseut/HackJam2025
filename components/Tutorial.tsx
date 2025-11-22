import React, { useState } from 'react';
import { Calendar, AlertCircle, Bot, Hand, ArrowRight, X, CheckCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const Tutorial: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Input Your Schedule",
      description: "Start by adding your fixed commitments like classes, work shifts, and club meetings. Use the form to specify days and times.",
      icon: <Calendar className="w-16 h-16 text-blue-500" />,
      color: "border-blue-500/30 bg-blue-500/10"
    },
    {
      title: "Set Priorities",
      description: "Mark your activities as High, Medium, or Low priority. This helps the AI understand what's most important when finding study gaps.",
      icon: <AlertCircle className="w-16 h-16 text-usf-gold" />,
      color: "border-usf-gold/30 bg-usf-gold/10"
    },
    {
      title: "AI Optimization",
      description: "Click 'Generate Schedule' to let our Gemini-powered AI analyze your free time and suggest the perfect study blocks.",
      icon: <Bot className="w-16 h-16 text-usf-green" />,
      color: "border-usf-green/30 bg-usf-green/10"
    },
    {
      title: "Swipe to Decide",
      description: "Review the AI's suggestions one by one. Swipe Right to add them to your calendar, or Swipe Left to discard them.",
      icon: <Hand className="w-16 h-16 text-purple-500" />,
      color: "border-purple-500/30 bg-purple-500/10"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative">
      
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors font-medium text-sm flex items-center gap-2"
      >
        Skip Tutorial <X className="w-4 h-4" />
      </button>

      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12 justify-center">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-12 bg-white' : 'w-4 bg-white/20'
              }`} 
            />
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
          
          <div className={`mb-8 p-6 rounded-full border ${steps[currentStep].color} transition-all duration-500 transform scale-100`}>
            {steps[currentStep].icon}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 transition-all duration-300">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto transition-all duration-300">
            {steps[currentStep].description}
          </p>

          {/* Background Decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-usf-green/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-10 flex justify-between items-center px-4">
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`text-gray-500 hover:text-white transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            {currentStep === steps.length - 1 ? (
              <>Start Planning <CheckCircle className="w-5 h-5" /></>
            ) : (
              <>Next Step <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;