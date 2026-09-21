import React from 'react';
import { MessageSquareText, WalletCards, CloudSun, MapPinned, ShieldCheck, Route } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: MessageSquareText,
      title: 'Conversational Travel Chat',
      description:
        'Speak naturally about your travel wishes. TourAI extracts starting point, budget, days, and interests, and asks clarifying follow-up questions when needed.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      icon: WalletCards,
      title: 'Strict Budget Discipline',
      description:
        'Avoids unfeasible luxury plans. Calculates itemized transport, stay, meals, and tickets to keep your trip well within your stated budget, tracking remaining savings.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      icon: CloudSun,
      title: 'Live Climate & Weather',
      description:
        'Never hard-coded. Real-time temperature, rainfall chance, humidity, and 3-day forecast fetched live via Open-Meteo API for your destination.',
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      icon: MapPinned,
      title: 'Practical Day-Wise Sequencing',
      description:
        'Morning, afternoon, and evening timelines planned with realistic transit times, opening hours, entry fees, and direct Google Maps navigation links.',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      icon: Route,
      title: 'Intercity Transit & Routes',
      description:
        'Provides multiple transit options from your origin—including state express buses, heritage toy trains, and highway cab routes with realistic durations.',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Live vs. Estimated Badging',
      description:
        'Clearly labels verified information versus estimated seasonal tariffs so you can budget with total confidence and zero surprises.',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <section id="features-section" className="py-16 bg-slate-900 text-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
            <span>Built for Modern Travelers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Why TourAI is Smarter Than Static Itineraries
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Combining state-of-the-art Gemini AI reasoning with live data services to deliver verified, actionable plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
