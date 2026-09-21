import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Compass } from 'lucide-react';
import type { WeatherInfo } from '../types';
import { LiveBadge } from './LiveBadge';

interface WeatherWidgetProps {
  weather: WeatherInfo;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="w-8 h-8 text-sky-500" />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="w-8 h-8 text-slate-400" />;
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div
      id="weather-widget-card"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm overflow-hidden relative"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Destination Climate & Weather</h3>
            <p className="text-xs text-slate-500">{weather.location}</p>
          </div>
        </div>
        <LiveBadge type={weather.isLive ? 'LIVE_VERIFIED' : 'ESTIMATED'} label={weather.isLive ? 'Live Weather' : 'Estimated'} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 my-2">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.condition)}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900">{weather.temperature}°C</span>
              <span className="text-xs text-slate-500 font-medium">({Math.round(weather.temperature * 1.8 + 32)}°F)</span>
            </div>
            <p className="text-xs font-medium text-slate-600 capitalize">{weather.condition}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5" title="Relative Humidity">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>{weather.humidity}% Humidity</span>
          </div>
          <div className="flex items-center gap-1.5" title="Wind Speed">
            <Wind className="w-4 h-4 text-slate-400" />
            <span>{weather.windSpeed} km/h Wind</span>
          </div>
          <div className="flex items-center gap-1.5" title="Precipitation Probability">
            <CloudRain className="w-4 h-4 text-indigo-500" />
            <span>{weather.rainProbability}% Rain</span>
          </div>
        </div>
      </div>

      {weather.forecast && weather.forecast.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">3-Day Outlook</p>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.slice(1, 4).map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                <p className="text-xs font-semibold text-slate-700">{f.day}</p>
                <p className="text-xs text-slate-500 truncate my-0.5">{f.condition}</p>
                <p className="text-xs font-bold text-slate-800">
                  {f.tempMax}° / <span className="text-slate-400 font-normal">{f.tempMin}°</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {weather.advisory && (
        <div className="mt-3 text-xs bg-sky-50/70 border border-sky-100 text-sky-900 rounded-xl p-2.5 flex items-start gap-2">
          <span className="text-base">💡</span>
          <p className="leading-relaxed">{weather.advisory}</p>
        </div>
      )}
    </div>
  );
};
