import React from 'react';
import { Calendar, Clock, ArrowRight, BrainCircuit, CheckCircle } from 'lucide-react';

interface Props {
  onStart: () => void;
  onTutorial: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart, onTutorial }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-bold text-white flex items-center gap-3">
             {/* Standard Calendar Icon */}
             <div className="w-12 h-12 bg-usf-green/10 rounded-xl flex items-center justify-center border border-usf-green/20">
                <Calendar className="w-7 h-7 text-usf-green" />
             </div>
            BULLPLANNER
          </div>
          <button
            onClick={onStart}
            className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-all"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-20 md:pt-32 px-6 relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-usf-green/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111] border border-white/10 text-gray-300 text-sm font-medium mb-8 hover:border-usf-green/50 transition-colors cursor-default">
          <BrainCircuit className="w-4 h-4 text-usf-green" />
          <span>AI-Powered Student Scheduler</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-center max-w-5xl leading-[1.1]">
          Your semester, <span className="text-transparent bg-clip-text bg-gradient-to-r from-usf-green to-usf-gold">perfectly planned.</span>
        </h1>
        
        <p className="text-xl text-gray-400 text-center max-w-2xl mb-12 leading-relaxed">
          Input your classes, work, and extracurriculars. Let our intelligent AI find the perfect study blocks so you can succeed without the burnout.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-24">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-usf-green hover:bg-usf-dark text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,103,71,0.4)]"
          >
            Start Planning Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onTutorial}
            className="px-8 py-4 bg-[#111] hover:bg-[#222] text-white border border-white/10 rounded-full font-bold text-lg transition-all"
          >
            See How It Works
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mb-20">
          <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-white/20 transition-all group">
             <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-blue-500" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-white">Smart Scheduling</h3>
             <p className="text-gray-400 leading-relaxed">
               Visualize your weekly commitments with a clean, intuitive interface built specifically for university life.
             </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-usf-green/50 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-usf-green/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="w-14 h-14 bg-usf-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-7 h-7 text-usf-green" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-white">Gemini AI Integration</h3>
             <p className="text-gray-400 leading-relaxed">
               Our AI analyzes gaps in your schedule to suggest optimal study times, prioritizing your most important classes.
             </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-white/20 transition-all group">
             <div className="w-14 h-14 bg-usf-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-usf-gold" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-white">Priority Management</h3>
             <p className="text-gray-400 leading-relaxed">
               Mark tasks as High, Medium, or Low priority. We help you balance academic success with personal well-being.
             </p>
          </div>
        </div>

        {/* Stats / Trust Section */}
        <div className="w-full max-w-7xl border-t border-white/10 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex gap-8">
              <div className="flex flex-col">
                 <span className="text-3xl font-bold text-white">100%</span>
                 <span className="text-sm text-gray-500">Free for Students</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-3xl font-bold text-white">24/7</span>
                 <span className="text-sm text-gray-500">AI Availability</span>
              </div>
           </div>
           <div className="flex items-center gap-2 text-gray-400 text-sm">
              <CheckCircle className="w-4 h-4 text-usf-green" />
              <span>Designed for USF Students</span>
           </div>
        </div>

      </main>
      
      <footer className="py-8 text-center text-gray-600 text-sm bg-black border-t border-white/5">
        © 2024 BULLPLANNER. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;