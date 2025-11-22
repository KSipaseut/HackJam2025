import React, { useState } from 'react';
import { ScheduleItem, AiSuggestion, ActivityType, Priority } from './types';
import ScheduleInputForm from './components/ScheduleInputForm';
import WeeklySchedule from './components/WeeklySchedule';
import SwipeInterface from './components/SwipeInterface';
import LandingPage from './components/LandingPage';
import Tutorial from './components/Tutorial';
import { generateStudySuggestions } from './services/geminiService';
import { Bot, Calendar as CalendarIcon, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

type AppScreen = 'landing' | 'tutorial' | 'planner';

function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [view, setView] = useState<'input' | 'suggestions'>('input');
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = (newItem: Omit<ScheduleItem, 'id'>) => {
    setItems(prev => [...prev, { ...newItem, id: generateId() }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleGenerateSuggestions = async () => {
    if (items.length === 0) {
        setError("Please add at least one item to your schedule first.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await generateStudySuggestions(items);
      if (results.length > 0) {
        setSuggestions(results);
        setView('suggestions');
      } else {
        setError("AI couldn't find good slots. Try adding more fixed events or freeing up space.");
      }
    } catch (e) {
      setError("Failed to connect to AI. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (s: AiSuggestion) => {
    const newItem: ScheduleItem = {
      id: generateId(),
      title: s.title,
      type: ActivityType.Study,
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
      priority: Priority.Medium, // Default priority for AI suggested study blocks
      isAiSuggested: true
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleFinishSuggestions = () => {
    setView('input');
  };

  if (screen === 'landing') {
    return <LandingPage onStart={() => setScreen('planner')} onTutorial={() => setScreen('tutorial')} />;
  }

  if (screen === 'tutorial') {
    return <Tutorial onComplete={() => setScreen('planner')} />;
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-usf-green selection:text-white">
      
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Standard Calendar Icon */}
            <div className="w-12 h-12 bg-usf-green/10 rounded-xl flex items-center justify-center border border-usf-green/20">
                 <CalendarIcon className="w-7 h-7 text-usf-green" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white">BULLPLANNER</h1>
            </div>
          </div>
          <div className="flex gap-3">
             {view !== 'input' && (
                <button 
                   onClick={() => setView('input')}
                   className="text-sm bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-full transition flex items-center gap-2 text-gray-300"
                >
                   <ArrowLeft className="w-4 h-4" /> Edit Schedule
                </button>
             )}
             <button 
                onClick={() => setScreen('landing')}
                className="text-sm text-gray-500 hover:text-white transition px-3 py-1.5"
             >
                Home
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Error Message */}
        {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-900/50 mb-6 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)}><ArrowLeft className="w-4 h-4" /></button>
            </div>
        )}

        {/* INPUT VIEW */}
        {view === 'input' && (
          <div className="flex flex-col gap-10">
            
            {/* Top Section: Activity Input & AI */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              
              {/* Column 1 (2/3 Width): Schedule Input Form */}
              <div className="xl:col-span-2">
                <ScheduleInputForm onAddItem={handleAddItem} />
              </div>

              {/* Column 2 (1/3 Width): AI Assistant Card */}
              <div className="xl:col-span-1">
                <div className="bg-[#111] rounded-3xl p-8 text-white relative overflow-hidden border border-white/10 group hover:border-usf-green/50 transition-colors duration-300 h-full flex flex-col justify-center">
                  <div className="relative z-10">
                      <div className="w-16 h-16 bg-usf-green/20 rounded-2xl flex items-center justify-center mb-6 text-usf-green">
                        <Bot className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-white">
                          AI Assistant
                      </h3>
                      <p className="text-base text-gray-400 mb-8 leading-relaxed">
                          I'll scan your week and find the perfect times to study based on your classes and priority levels.
                      </p>
                      <button
                          onClick={handleGenerateSuggestions}
                          disabled={loading || items.length === 0}
                          className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                      >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-usf-green" />}
                          {loading ? 'Analyzing...' : 'Generate Schedule'}
                      </button>
                  </div>
                  
                  {/* Decorative shapes matching landing page */}
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-design-teal/10 rotate-45 rounded-xl blur-xl"></div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Weekly Overview - Pops up when items are added */}
            {items.length > 0 && (
              <div className="bg-[#111] rounded-3xl border border-white/10 p-8 min-h-[500px]">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                   <span className="w-2 h-8 bg-usf-green rounded-full"></span>
                   Weekly Overview
                </h2>
                <WeeklySchedule items={items} onRemoveItem={handleRemoveItem} />
              </div>
            )}
          </div>
        )}

        {/* SWIPE VIEW (Split Screen) */}
        {view === 'suggestions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Real-time Weekly Overview */}
            <div className="lg:col-span-2 bg-[#111] rounded-3xl border border-white/10 p-6 h-fit">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                     <span className="w-2 h-8 bg-usf-green rounded-full"></span>
                     Week at a Glance
                  </h2>
                  <span className="text-sm text-gray-500">Updates in real-time</span>
               </div>
               {/* Wrap in overflow to handle the min-width of the schedule component */}
               <div className="overflow-x-auto">
                  <WeeklySchedule items={items} onRemoveItem={handleRemoveItem} />
               </div>
            </div>

            {/* Right Column: Swipe Interface */}
            <div className="lg:col-span-1 flex flex-col">
               <div className="sticky top-24"> {/* Sticky so it stays in view if schedule is tall */}
                  <div className="bg-[#111] rounded-3xl border border-white/10 p-8 shadow-2xl shadow-usf-green/5">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 bg-usf-green/10 rounded-full mb-4 text-usf-green">
                           <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Study Suggestions</h2>
                        <p className="text-gray-400 text-sm">Swipe right to add to your schedule</p>
                    </div>
                    
                    <SwipeInterface 
                        suggestions={suggestions}
                        onAccept={handleAcceptSuggestion}
                        onReject={() => {}}
                        onFinish={handleFinishSuggestions}
                    />
                    
                     <div className="flex justify-center mt-8 pt-8 border-t border-white/5">
                         <button 
                            onClick={() => setView('input')} 
                            className="text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Editor
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;