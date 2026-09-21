export interface PlaceItem {
  id: string;
  name: string;
  description: string;
  location: string;
  category: 'nature' | 'heritage' | 'adventure' | 'beach' | 'culture' | 'food' | 'viewpoint' | 'shopping';
  thingsToDo: string[];
  bestTimeToVisit: string;
  openingHours: string;
  entryFee: string;
  entryFeeNumber: number;
  nearbyAttractions: string[];
  liveOrEstimated: 'LIVE_VERIFIED' | 'ESTIMATED';
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  approxDuration: string;
  mapSearchQuery: string;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  theme: string;
  places: PlaceItem[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  transportAdvice: string;
}

export interface BudgetBreakdown {
  currency: string;
  transportation: number;
  transportationDetails: string;
  accommodation: number;
  accommodationDetails: string;
  food: number;
  foodDetails: string;
  entryTickets: number;
  entryTicketsDetails: string;
  otherExpenses: number;
  otherExpensesDetails: string;
  totalEstimated: number;
  userBudget: number;
  remainingBudget: number;
  status: 'comfortably_within' | 'tight' | 'exceeds';
  isEstimated: boolean;
}

export interface WeatherForecastDay {
  day: string;
  tempMin: number;
  tempMax: number;
  condition: string;
}

export interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  forecast: WeatherForecastDay[];
  isLive: boolean;
  advisory: string;
}

export interface HotelRecommendation {
  name: string;
  type: 'Budget' | 'Mid-Range' | 'Boutique' | 'Homestay';
  estPricePerNight: number;
  currency: string;
  location: string;
  rating: number;
  amenities: string[];
  isEstimated: boolean;
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  priceCategory: '₹' | '₹₹' | '₹₹₹';
  specialty: string;
  location: string;
}

export interface TravelRouteOption {
  mode: string;
  duration: string;
  costEst: number;
  details: string;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  stateOrCountry: string;
  startingPoint: string;
  durationDays: number;
  peopleCount: number;
  interests: string[];
  userBudget: number;
  currency: string;
  whySuggested: string;
  distanceKm: number;
  travelRoutes: TravelRouteOption[];
  itinerary: DayItinerary[];
  budgetBreakdown: BudgetBreakdown;
  weather: WeatherInfo;
  hotels: HotelRecommendation[];
  restaurants: RestaurantRecommendation[];
  travelTips: string[];
  liveDataSources: {
    weather: 'Live (Open-Meteo)' | 'Estimated';
    timings: 'Live Verified' | 'Estimated Standard';
    ticketPrices: 'Standard Tariff (Estimated)';
    routes: 'Live Calculation' | 'Estimated Route';
  };
  createdAt: string;
}

export interface TripQuery {
  rawInput: string;
  startingLocation?: string;
  budget?: number;
  currency?: string;
  durationDays?: number;
  peopleCount?: number;
  interests?: string[];
  preferredDestination?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  extractedQuery?: Partial<TripQuery>;
  suggestedQuestions?: string[];
  tripPlan?: TripPlan;
  isThinking?: boolean;
}

export interface PopularDestination {
  id: string;
  name: string;
  tagline: string;
  image: string;
  startingFrom: string;
  idealDays: number;
  budgetFrom: number;
  currency: string;
  tags: string[];
  bestSeason: string;
}
