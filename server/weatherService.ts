import type { WeatherInfo } from '../src/types';

const weatherCodeMap: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
};

// Known coordinates for fast lookup / fallback
const knownCoords: Record<string, { lat: number; lon: number; defaultTemp: number; state: string }> = {
  ooty: { lat: 11.4064, lon: 76.6932, defaultTemp: 18, state: 'Tamil Nadu' },
  coimbatore: { lat: 11.0168, lon: 76.9558, defaultTemp: 29, state: 'Tamil Nadu' },
  munnar: { lat: 10.0889, lon: 77.0595, defaultTemp: 19, state: 'Kerala' },
  wayanad: { lat: 11.6854, lon: 76.1320, defaultTemp: 22, state: 'Kerala' },
  kodaikanal: { lat: 10.2381, lon: 77.4892, defaultTemp: 17, state: 'Tamil Nadu' },
  coorg: { lat: 12.3375, lon: 75.8069, defaultTemp: 21, state: 'Karnataka' },
  pondicherry: { lat: 11.9416, lon: 79.8083, defaultTemp: 30, state: 'Puducherry' },
  goa: { lat: 15.2993, lon: 74.1240, defaultTemp: 31, state: 'Goa' },
  jaipur: { lat: 26.9124, lon: 75.7873, defaultTemp: 28, state: 'Rajasthan' },
  manali: { lat: 32.2432, lon: 77.1892, defaultTemp: 14, state: 'Himachal Pradesh' },
  rishikesh: { lat: 30.0869, lon: 78.2676, defaultTemp: 24, state: 'Uttarakhand' },
  chennai: { lat: 13.0827, lon: 80.2707, defaultTemp: 32, state: 'Tamil Nadu' },
  bengaluru: { lat: 12.9716, lon: 77.5946, defaultTemp: 26, state: 'Karnataka' },
  bangalore: { lat: 12.9716, lon: 77.5946, defaultTemp: 26, state: 'Karnataka' },
  mumbai: { lat: 19.0760, lon: 72.8777, defaultTemp: 30, state: 'Maharashtra' },
  delhi: { lat: 28.6139, lon: 77.2090, defaultTemp: 27, state: 'Delhi' },
  agra: { lat: 27.1767, lon: 78.0081, defaultTemp: 29, state: 'Uttar Pradesh' },
  alleppey: { lat: 9.4981, lon: 76.3388, defaultTemp: 29, state: 'Kerala' },
  hampi: { lat: 15.3350, lon: 76.4600, defaultTemp: 30, state: 'Karnataka' },
};

export async function fetchLiveWeather(locationName: string): Promise<WeatherInfo> {
  const norm = locationName.toLowerCase().trim();
  let lat = 11.4064;
  let lon = 76.6932;
  let isFound = false;

  for (const [key, coords] of Object.entries(knownCoords)) {
    if (norm.includes(key) || key.includes(norm)) {
      lat = coords.lat;
      lon = coords.lon;
      isFound = true;
      break;
    }
  }

  // If not found in known coordinates, try Open-Meteo Geocoding API
  if (!isFound) {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
          isFound = true;
        }
      }
    } catch {
      // Ignore geocoding errors and proceed with fallback
    }
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const res = await fetch(weatherUrl);

    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const daily = data.daily || {};

      const weatherCode = current.weather_code ?? 1;
      const condition = weatherCodeMap[weatherCode] || 'Pleasant';
      const temp = Math.round(current.temperature_2m ?? 22);
      const humidity = Math.round(current.relative_humidity_2m ?? 65);
      const windSpeed = Math.round(current.wind_speed_10m ?? 12);
      const rainProb = daily.precipitation_probability_max?.[0] ?? 10;

      const daysOfWeek = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
      const forecast = (daily.time || []).slice(0, 4).map((_: string, idx: number) => ({
        day: daysOfWeek[idx] || `Day ${idx + 1}`,
        tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? temp - 5),
        tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? temp + 4),
        condition: weatherCodeMap[daily.weather_code?.[idx] ?? 0] || 'Clear',
      }));

      let advisory = 'Great weather for sightseeing! Carry comfortable walking shoes.';
      if (temp < 18) {
        advisory = 'Pleasantly cool! Pack light woolens or a jacket for morning & evening visits.';
      } else if (rainProb > 40) {
        advisory = 'Chances of light showers. Carrying a compact umbrella or raincoat is advised.';
      } else if (temp > 32) {
        advisory = 'Warm conditions. Stay hydrated and schedule outdoor viewpoints for morning or sunset.';
      }

      return {
        location: locationName,
        temperature: temp,
        condition,
        weatherCode,
        humidity,
        windSpeed,
        rainProbability: rainProb,
        forecast,
        isLive: true,
        advisory,
      };
    }
  } catch {
    // Return fallback if network fails
  }

  // Graceful fallback
  return {
    location: locationName,
    temperature: 21,
    condition: 'Pleasant & Mild',
    weatherCode: 1,
    humidity: 60,
    windSpeed: 10,
    rainProbability: 15,
    forecast: [
      { day: 'Today', tempMin: 15, tempMax: 23, condition: 'Partly cloudy' },
      { day: 'Tomorrow', tempMin: 14, tempMax: 24, condition: 'Sunny' },
      { day: 'Day 3', tempMin: 16, tempMax: 22, condition: 'Clear' },
    ],
    isLive: false,
    advisory: 'Estimated weather: Comfortable daytime weather with cool mountain breeze. Carry light layers.',
  };
}
