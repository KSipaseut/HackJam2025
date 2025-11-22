import React from 'react';
import { ScheduleItem, DAYS_ORDER, ActivityType, Priority } from '../types';
import { Trash2 } from 'lucide-react';

interface Props {
  items: ScheduleItem[];
  onRemoveItem: (id: string) => void;
}

const WeeklySchedule: React.FC<Props> = ({ items, onRemoveItem }) => {
  
  const timeToMins = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const getTypeStyles = (type: ActivityType) => {
    // Updated for Pure Black theme
    // Using darker grays (#1a1a1a) for cards so they stand out on #000000 or #111111
    const base = 'bg-[#1a1a1a] text-white border border-white/10 border-l-4 transition-all duration-200 hover:border-white/40 hover:-translate-y-0.5';
    
    switch (type) {
      case ActivityType.Class: return `${base} border-l-blue-500`;
      case ActivityType.Work: return `${base} border-l-orange-500`;
      case ActivityType.Study: return `${base} border-l-usf-green`;
      case ActivityType.Event: return `${base} border-l-purple-500`;
      case ActivityType.Extra: return `${base} border-l-pink-500`;
      default: return `${base} border-l-gray-500`;
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.High: return 'text-red-500';
      case Priority.Medium: return 'text-yellow-500';
      case Priority.Low: return 'text-blue-400';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[800px] grid grid-cols-7 gap-2">
        {DAYS_ORDER.map(day => (
          <div key={day} className="flex flex-col gap-2">
            <div className="text-center font-bold text-gray-500 uppercase tracking-wider text-xs py-4 border-b border-white/10">
              {day.substring(0, 3)}
            </div>
            
            <div className="flex flex-col gap-2 min-h-[200px] pt-4">
              {items
                .filter(item => item.day === day)
                .sort((a, b) => timeToMins(a.startTime) - timeToMins(b.startTime))
                .map(item => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl relative group cursor-default ${getTypeStyles(item.type)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold truncate pr-4 text-sm text-white">{item.title}</div>
                      {item.priority && !item.isAiSuggested && (
                         <span className={`text-[9px] uppercase font-bold tracking-wider ${getPriorityColor(item.priority)}`}>
                            {item.priority === Priority.High ? '!!!' : ''}
                         </span>
                      )}
                    </div>
                    <div className="font-medium text-gray-400 mt-1 text-xs group-hover:text-gray-200 transition-colors">
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </div>
                    {item.isAiSuggested && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-usf-gold rounded-full shadow-[0_0_5px_#CFC493]" title="AI Suggested"></div>
                    )}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition text-gray-500"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {items.filter(item => item.day === day).length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white/5 rounded-full"></div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;