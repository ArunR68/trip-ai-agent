import React, { useState } from 'react';
import { Sparkles, MapPin, Wallet, Calendar, Users, ArrowRight, Compass, Search, SlidersHorizontal } from 'lucide-react';
import type { TripQuery } from '../types';

interface HeroSectionProps {
  onPlanTrip: (prompt: string, structured?: Partial<TripQuery>) => void;
  isLoading: boolean;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlanTrip, isLoading, onOpenChat }) => {
  const [promptInput, setPromptInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Structured fields
  const [startCity, setStartCity] = useState('Coimbatore');
  const [budget, setBudget] = useState(5000);
  const [currency, setCurrency] = useState('₹');
  const [days, setDays] = useState(2);
  const [people, setPeople] = useState(1);
  const [vibe, setVibe] = useState('Nature');

  const examplePrompts = [
    { text: '“I have ₹5000 and 2 days. I’m in Coimbatore. I like nature places. Suggest a trip.”', label: 'Coimbatore ➔ Ooty Nature (₹5k)' },
    { text: '“Suggest a budget trip from Chennai for 3 days.”', label: 'Chennai ➔ Pondicherry 3 Days' },
    { text: '“I want beaches and adventure places under ₹10,000.”', label: 'Beaches & Adventure < ₹10k' },
    { text: '“Plan a family trip for 4 people from Bangalore for 3 days.”', label: 'Bangalore Family Trip (4 pax)' },
  ];

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    onPlanTrip(promptInput.trim());
  };

  const handleStructuredSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const generatedPrompt = `I have ${currency}${budget} and ${days} days. I'm in ${startCity}. I like ${vibe} places. Travel with ${people} person(s). Suggest a trip.`;
    onPlanTrip(generatedPrompt, {
      startingLocation: startCity,
      budget,
      currency,
      durationDays: days,
      peopleCount: people,
      interests: [vibe],
    });
  };

  return (
    <div id="hero-section" className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/50 via-sky-50/40 to-transparent -z-10 rounded-3xl blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto text-center px-4 sm:px-6">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>TourAI Travel Intelligence Engine</span>
          <span className="text-emerald-300">•</span>
          <span className="text-emerald-700">Live Weather & Verified Tariffs</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
          Where do you want to go?
          <span className="block text-emerald-700 font-serif italic text-3xl sm:text-4xl lg:text-5xl font-normal mt-1">
            Let AI plan the perfect trip for your budget.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Type your budget, starting location, and travel style in plain English.
          TourAI crafts realistic day-wise itineraries, itemized expense breakdowns, and real-time climate checks.
        </p>

        {/* Main Search / Planning Box */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-5 shadow-xl border border-slate-200/80 max-w-3xl mx-auto text-left relative z-10 transition-all">
          {!showAdvanced ? (
            <form onSubmit={handleSubmitPrompt} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Compass className="w-5 h-5 text-emerald-600" />
                  </div>
                  <input
                    id="hero-travel-input"
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g. “I have ₹5000 and 2 days. I'm in Coimbatore. I like nature places. Suggest a trip.”"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium transition-all"
                  />
                </div>

                <button
                  id="plan-my-trip-btn"
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Planning Your Trip...</span>
                  ) : (
                    <>
                      <span>Plan My Trip</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Mode Switch & Quick helper */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500 px-1">
                <span>Try natural English or switch to custom trip builder</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenChat}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Open AI Chat Assistant</span>
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(true)}
                    className="text-xs font-semibold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Custom Filter Mode</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Structured Form Mode */
            <form onSubmit={handleStructuredSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Custom Travel Parameters
                </span>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(false)}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  Switch to Natural Language
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Starting Point</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={startCity}
                      onChange={(e) => setStartCity(e.target.value)}
                      placeholder="e.g. Coimbatore, Chennai, Bangalore"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Budget</label>
                  <div className="flex items-center gap-1">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="₹">₹ INR</option>
                      <option value="$">$ USD</option>
                      <option value="€">€ EUR</option>
                    </select>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      step={500}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Days)</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value={1}>1 Day (Day Trip)</option>
                      <option value={2}>2 Days (Weekend Trip)</option>
                      <option value={3}>3 Days (Long Weekend)</option>
                      <option value={4}>4 Days (Relaxed Vacation)</option>
                      <option value={5}>5 Days</option>
                      <option value={7}>7 Days (Full Week)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Travelers</label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={people}
                      onChange={(e) => setPeople(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value={1}>Solo Explorer (1)</option>
                      <option value={2}>Couple / 2 Friends (2)</option>
                      <option value={3}>Small Group (3)</option>
                      <option value={4}>Family / Friends (4)</option>
                      <option value={5}>Group of 5+</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Primary Interest / Vibe</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Nature', 'Hill Station', 'Beaches', 'Heritage & Culture', 'Adventure & Trekking', 'Food & Cafes'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVibe(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          vibe === v
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Generate Customized Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Example Prompt Chips */}
        <div className="mt-5 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular prompt queries (Click to test instantly):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((p, idx) => (
              <button
                key={idx}
                id={`hero-prompt-chip-${idx}`}
                onClick={() => {
                  setPromptInput(p.text.replace(/^[“”"']|[“”"']$/g, ''));
                  onPlanTrip(p.text.replace(/^[“”"']|[“”"']$/g, ''));
                }}
                className="text-xs bg-white/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-xl transition-all shadow-2xs text-left"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
