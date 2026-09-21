import React from 'react';
import { Compass, Bookmark, MessageSquare, Sparkles, RefreshCw } from 'lucide-react';

interface NavbarProps {
  savedTripsCount: number;
  onOpenSavedTrips: () => void;
  onOpenChat: () => void;
  onNewTrip: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedTripsCount,
  onOpenSavedTrips,
  onOpenChat,
  onNewTrip,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={onNewTrip}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                Tour<span className="text-emerald-600">AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Smart Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">AI Travel Agent & Smart Trip Planner</p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-chat-btn"
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 px-3 py-2 rounded-xl transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">AI Travel Chat</span>
          </button>

          <button
            id="nav-saved-btn"
            onClick={onOpenSavedTrips}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition-colors relative"
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Saved Trips</span>
            {savedTripsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedTripsCount}
              </span>
            )}
          </button>

          <button
            id="nav-new-trip-btn"
            onClick={onNewTrip}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
