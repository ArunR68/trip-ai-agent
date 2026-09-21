import type { TripPlan, TripQuery, WeatherInfo, PopularDestination } from '../types';

export async function sendChatMessage(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<{
  text: string;
  tripPlan?: TripPlan;
  extractedQuery?: Partial<TripQuery>;
  suggestedQuestions?: string[];
}> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to communicate with TourAI travel agent');
  }

  return res.json();
}

export async function generateTripPlan(criteria: Partial<TripQuery> & { prompt?: string }): Promise<TripPlan> {
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate personalized trip plan');
  }

  return res.json();
}

export async function fetchLiveWeather(location: string): Promise<WeatherInfo> {
  const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch live weather data');
  }
  return res.json();
}

export async function fetchPopularDestinations(): Promise<PopularDestination[]> {
  const res = await fetch('/api/destinations/popular');
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export async function fetchSavedTrips(): Promise<TripPlan[]> {
  try {
    const res = await fetch('/api/trips');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore
  }
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem('tourai_saved_trips');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTripToStorage(trip: TripPlan): Promise<void> {
  // Sync with server
  try {
    await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip),
    });
  } catch {
    // ignore
  }

  // Sync with localStorage
  try {
    const existing = await fetchSavedTrips();
    const filtered = existing.filter(t => t.id !== trip.id);
    filtered.unshift(trip);
    localStorage.setItem('tourai_saved_trips', JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export async function deleteTripFromStorage(id: string): Promise<void> {
  try {
    await fetch(`/api/trips/${id}`, { method: 'DELETE' });
  } catch {
    // ignore
  }

  try {
    const existing = await fetchSavedTrips();
    const filtered = existing.filter(t => t.id !== id);
    localStorage.setItem('tourai_saved_trips', JSON.stringify(filtered));
  } catch {
    // ignore
  }
}
