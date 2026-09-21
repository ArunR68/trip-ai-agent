import React from 'react';
import { Sparkles, ArrowRight, MapPin, Calendar, Wallet } from 'lucide-react';
import type { PopularDestination } from '../types';

interface PopularDestinationsProps {
  destinations: PopularDestination[];
  onSelectDestination: (dest: PopularDestination) => void;
  isLoading: boolean;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  onSelectDestination,
  isLoading,
}) => {
  return (
    <section id="popular-destinations" className="py-12 border-t border-slate-200/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Handpicked Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Escapes & Weekend Trips
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top curated getaways with pre-computed budget estimates and transit routes
            </p>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              id={`dest-card-${dest.id}`}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col group cursor-pointer"
              onClick={() => onSelectDestination(dest)}
            >
              {/* Image Preview / Gradient */}
              <div className="h-36 relative overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized gradient banner if image fails
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/20">
                    {dest.idealDays} Days
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1 leading-tight drop-shadow-xs">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                    {dest.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {dest.tags.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Budget from</span>
                    <span className="font-extrabold text-emerald-700">
                      {dest.currency}{dest.budgetFrom.toLocaleString()}
                    </span>
                  </div>

                  <button
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors"
                  >
                    <span>Plan Trip</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
