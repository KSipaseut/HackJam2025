import React, { useState } from 'react';
import { ActivityType, DayOfWeek, DAYS_ORDER, ScheduleItem, Priority } from '../types';
import { AlertCircle } from 'lucide-react';

interface Props {
  onAddItem: (item: Omit<ScheduleItem, 'id'>) => void;
}

// 1-12 for hours
const HOURS_12 = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
// 00-55 for minutes
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
const AMPM_OPTIONS = ['AM', 'PM'];

const ScheduleInputForm: React.FC<Props> = ({ onAddItem }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>(ActivityType.Class);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  
  // Internal state kept in 24h format for consistency with backend/types
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:15');

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Helper to convert 24h string (HH:mm) to 12h parts
  const get12HourParts = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    let hour = h % 12;
    if (hour === 0) hour = 12;
    return { hour: hour.toString(), minute: m.toString().padStart(2, '0'), ampm };
  };

  // Helper to convert 12h parts back to 24h string
  const to24Hour = (hour: string, minute: string, ampm: string) => {
    let h = parseInt(hour, 10);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minute}`;
  };

  const handleTimeChange = (field: 'start' | 'end', part: 'hour' | 'minute' | 'ampm', value: string) => {
    const current24 = field === 'start' ? startTime : endTime;
    const currentParts = get12HourParts(current24);
    
    const newParts = { ...currentParts, [part]: value };
    const newTime24 = to24Hour(newParts.hour, newParts.minute, newParts.ampm);

    if (field === 'start') {
      setStartTime(newTime24);
    } else {
      setEndTime(newTime24);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || selectedDays.length === 0) return;

    // Create an item for each selected day
    selectedDays.forEach(day => {
      onAddItem({
        title,
        type,
        day,
        startTime,
        endTime,
        priority,
        isAiSuggested: false
      });
    });

    // Reset form partially
    setTitle('');
    setSelectedDays([]);
    setPriority(Priority.Medium);
  };

  const startParts = get12HourParts(startTime);
  const endParts = get12HourParts(endTime);

  return (
    <div className="bg-[#111] p-8 md:p-10 rounded-3xl border border-white/10 h-full">
      <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        Add Activity
      </h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Title & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Activity Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Intro to CS"
              className="w-full px-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green focus:ring-1 focus:ring-usf-green outline-none transition text-white placeholder-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className="w-full px-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green focus:ring-1 focus:ring-usf-green outline-none transition text-white cursor-pointer"
            >
              {Object.values(ActivityType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Days Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Days (Repeat)</label>
          <div className="flex flex-wrap gap-3">
            {DAYS_ORDER.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-5 py-3 text-sm font-bold rounded-xl transition-all border ${
                  selectedDays.includes(day)
                    ? 'bg-white text-black border-white'
                    : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:bg-[#222] hover:text-white'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection with 12h Dropdowns - STACKED LAYOUT */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Start Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Start Time</label>
            <div className="flex items-center gap-3">
              {/* Hour */}
              <select 
                value={startParts.hour}
                onChange={(e) => handleTimeChange('start', 'hour', e.target.value)}
                className="flex-1 min-w-[60px] px-3 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green outline-none text-white text-center text-lg appearance-none cursor-pointer hover:bg-[#222]"
              >
                {HOURS_12.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="text-gray-600 font-bold text-xl">:</span>
              {/* Minute */}
              <select 
                value={startParts.minute}
                onChange={(e) => handleTimeChange('start', 'minute', e.target.value)}
                className="flex-1 min-w-[60px] px-3 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green outline-none text-white text-center text-lg appearance-none cursor-pointer hover:bg-[#222]"
              >
                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {/* AM/PM */}
              <select
                value={startParts.ampm}
                onChange={(e) => handleTimeChange('start', 'ampm', e.target.value)}
                className="flex-1 min-w-[60px] px-2 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green outline-none text-white text-center font-bold text-lg appearance-none cursor-pointer hover:bg-[#222]"
              >
                {AMPM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">End Time</label>
            <div className="flex items-center gap-3">
              {/* Hour */}
              <select 
                value={endParts.hour}
                onChange={(e) => handleTimeChange('end', 'hour', e.target.value)}
                className="flex-1 min-w-[60px] px-3 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green outline-none text-white text-center text-lg appearance-none cursor-pointer hover:bg-[#222]"
              >
                {HOURS_12.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="text-gray-600 font-bold text-xl">:</span>
              {/* Minute */}
              <select 
                value={endParts.minute}
                onChange={(e) => handleTimeChange('end', 'minute', e.target.value)}
                className="flex-1 min-w-[60px] px-3 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green outline-none text-white text-center text-lg appearance-none cursor-pointer hover:bg-[#222]"
              >
                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
               {/* AM/PM */}
               <select
                value={endParts.ampm}
                onChange={(e) => handleTimeChange('end', 'ampm', e.target.value)}
                className="flex-1 min-w-[60px] px-2 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:border-usf-green outline-none text-white text-center font-bold text-lg appearance-none cursor-pointer hover:bg-[#222]"
              >
                {AMPM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Priority</label>
          <div className="flex gap-4">
            {[Priority.Low, Priority.Medium, Priority.High].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                  priority === p
                    ? p === Priority.High
                      ? 'bg-red-500/20 text-red-500 border-red-500'
                      : p === Priority.Medium
                      ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
                      : 'bg-blue-500/20 text-blue-500 border-blue-500'
                    : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:bg-[#222]'
                }`}
              >
                {p === Priority.High && <AlertCircle className="w-4 h-4" />}
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!title || selectedDays.length === 0}
          className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent mt-4 shadow-lg shadow-white/10"
        >
          Add to Schedule
        </button>
      </form>
    </div>
  );
};

export default ScheduleInputForm;