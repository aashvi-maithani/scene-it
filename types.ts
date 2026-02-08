
export interface LocationData {
  name: string;
  country: string;
  airportCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  realWorldImage: string;
  streetViewUrl?: string;
}

export interface VibeData {
  tags: string[];
  description: string;
  aesthetics: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface FlightDetails {
  price: string;
  airline: string;
  duration: string;
  stops: string;
  departureTime: string;
  bookingUrl?: string;
  airlineLogo?: string;
  cheapestOption?: {
    price: string;
    month: string;
    bookingUrl?: string;
  };
}

export interface HotelDetails {
  name: string;
  pricePerNight: string;
  rating: number;
  imageUrl: string;
  matchScore: number;
  bookingUrl?: string;
}

export interface TripLogistics {
  flight: FlightDetails;
  hotel: HotelDetails;
}

export interface AnalysisResult {
  location: LocationData;
  vibe: VibeData;
  logistics: TripLogistics;
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  FETCHING = 'FETCHING',
  RESULTS = 'RESULTS',
}

// --- NEW TYPES FOR SCENARIO DEMO ---

export interface ArbitrageOption {
  type: 'original' | 'dupe' | 'domestic' | 'time-travel';
  title: string;
  location?: string;
  price: string;
  badge: string;
  imageUrl?: string; // Optional for time-travel cards using graphs/abstracts
  savings?: string;
  description?: string; // For Time Traveler context
}

export interface MockScenario {
  id: string;
  dreamImage: string;
  realityImage: string;
  options: ArbitrageOption[];
}
