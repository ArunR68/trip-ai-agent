import React from 'react';
import { MapPin, Clock, Calendar, Ticket, Compass, ExternalLink, Sparkles } from 'lucide-react';
import type { PlaceItem } from '../types';
import { LiveBadge } from './LiveBadge';

interface PlaceDetailCardProps {
  place: PlaceItem;
  index: number;
}

export const PlaceDetailCard: React.FC<PlaceDetailCardProps> = ({ place, index }) => {
  const getGoogleMapsUrl = (query: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || place.name)}`;
  };

  const timeSlotColor = {
    Morning: 'bg-amber-100/70 text-amber-800 border-amber-200',
    Afternoon: 'bg-sky-100/70 text-sky-800 border-sky-200',
    Evening: 'bg-indigo-100/70 text-indigo-800 border-indigo-200',
  }[place.timeSlot] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      id={`place-card-${place.id || index}`}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${timeSlotColor}`}>
            {place.timeSlot} • Stop {index + 1}
          </span>
          <span className="text-xs text-slate-400">• {place.approxDuration}</span>
        </div>
        <div className="flex items-center gap-2">
          <LiveBadge type={place.liveOrEstimated} label={place.liveOrEstimated === 'LIVE_VERIFIED' ? 'Verified Hours' : 'Estimated'} />
        </div>
      </div>

      {/* Title & Location */}
      <div className="mb-2">
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {place.name}
        </h4>
        <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>{place.location}</span>
        </p>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        {place.description}
      </p>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-xs">
        <div className="flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Opening Hours</span>
            <span className="font-medium text-slate-800">{place.openingHours}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Ticket className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Entry Fee</span>
            <span className="font-semibold text-emerald-700">{place.entryFee}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Best Time</span>
            <span className="font-medium text-slate-800">{place.bestTimeToVisit}</span>
          </div>
        </div>
      </div>

      {/* Things to do */}
      {place.thingsToDo && place.thingsToDo.length > 0 && (
        <div className="mb-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Things to Experience
          </span>
          <div className="flex flex-wrap gap-1.5">
            {place.thingsToDo.map((act, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60"
              >
                {act}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Attractions & Map Action */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {place.nearbyAttractions && place.nearbyAttractions.length > 0 ? (
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Nearby: {place.nearbyAttractions.slice(0, 2).join(', ')}</span>
          </div>
        ) : (
          <span />
        )}

        <a
          id={`map-btn-${place.id || index}`}
          href={getGoogleMapsUrl(place.mapSearchQuery || place.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors ml-auto"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View on Map</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
        </a>
      </div>
    </div>
  );
};
