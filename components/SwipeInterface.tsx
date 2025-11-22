import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { AiSuggestion } from '../types';
import { Check, X, Sparkles, Calendar, Clock } from 'lucide-react';

interface Props {
  suggestions: AiSuggestion[];
  onAccept: (suggestion: AiSuggestion) => void;
  onReject: () => void; // Just to advance state
  onFinish: () => void;
}

interface SwipeCardProps {
  suggestion: AiSuggestion;
  onSwipe: (dir: 'left' | 'right') => void;
}

const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const SwipeCard: React.FC<SwipeCardProps> = ({ suggestion, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Dark mode colors for background transition
  // red-900/20 -> gray-800 -> green-900/20
  const bg = useTransform(x, [-200, 0, 200], ["#3f1515", "#1f2937", "#064e3b"]); 

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, background: bg }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center justify-center p-6 cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-usf-green/20 p-4 rounded-full mb-6 border border-usf-green/30 shadow-[0_0_15px_rgba(0,103,71,0.3)]">
        <Sparkles className="w-8 h-8 text-usf-green" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-100 text-center mb-2">{suggestion.title}</h3>
      
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        <Calendar className="w-4 h-4 text-usf-gold" />
        <span className="font-medium">{suggestion.day}</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-400 mb-6">
        <Clock className="w-4 h-4 text-usf-gold" />
        <span>{formatTime(suggestion.startTime)} - {formatTime(suggestion.endTime)}</span>
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg w-full text-center border border-gray-700">
        <p className="text-sm text-gray-300 italic">"{suggestion.reason}"</p>
      </div>

      <div className="absolute bottom-8 flex gap-12">
        <div className="text-red-500 flex flex-col items-center opacity-40">
          <div className="p-3 border-2 border-red-500 rounded-full mb-1">
            <X className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold tracking-widest">NOPE</span>
        </div>
        <div className="text-green-500 flex flex-col items-center opacity-40">
          <div className="p-3 border-2 border-green-500 rounded-full mb-1">
             <Check className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold tracking-widest">YES</span>
        </div>
      </div>
    </motion.div>
  );
};

const SwipeInterface: React.FC<Props> = ({ suggestions, onAccept, onReject, onFinish }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= suggestions.length) {
      onFinish();
    }
  }, [index, suggestions.length, onFinish]);

  const handleSwipe = (dir: 'left' | 'right') => {
    if (dir === 'right') {
      onAccept(suggestions[index]);
    } else {
      onReject();
    }
    setIndex(prev => prev + 1);
  };

  if (index >= suggestions.length) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto relative">
      <div className="w-full h-[400px] relative perspective-1000">
        <AnimatePresence>
          {/* Render only current card for performance, or maybe next one behind if needed */}
          <SwipeCard 
            key={index} // Key ensures remount on index change for simple exit animation
            suggestion={suggestions[index]} 
            onSwipe={handleSwipe} 
          />
        </AnimatePresence>
      </div>
      <p className="mt-8 text-gray-500 text-sm">Swipe Right to Accept, Left to Reject</p>
    </div>
  );
};

export default SwipeInterface;