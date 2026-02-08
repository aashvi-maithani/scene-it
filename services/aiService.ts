
import { GoogleGenAI, Type } from "@google/genai";
import { LocationData, VibeData, TripLogistics } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We store the backend result promise here to reuse it across the steps
let backendPromise: Promise<any> | null = null;

// Helper to simulate the public URL requirement for Google Lens
const MOCK_UPLOAD_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Jiufen_Old_Street_at_night.jpg/1200px-Jiufen_Old_Street_at_night.jpg";

// Helper: Convert File to Base64 for Gemini
const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (base64String) {
        resolve({
          inlineData: {
            data: base64String.split(',')[1],
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Fallback Logic: Uses Gemini to simulate the trip plan if Backend is down.
 */
const runClientSideFallback = async (file: File) => {
  console.warn("⚠️ Backend unreachable (localhost:3001). Switching to AI Simulation Mode.");
  
  const imagePart = await fileToGenerativePart(file);
  
  // Single monolithic prompt to get all data at once
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        imagePart,
        { text: `
          Identify the real-world location in this image.
          Then, plan a hypothetical 1-week trip there 30 days from now.
          Provide:
          1. Location Name & Country
          2. Nearest Airport Code (IATA)
          3. Estimated Flight details (Price, Airline, Duration, Stops)
          4. Recommended Hotel (Name, Price, Rating, Match Score)
          
          Return JSON matching this structure exactly:
          {
            "location": { "name": "City Name", "country": "Country", "airportCode": "XYZ" },
            "logistics": {
              "flight": { "price": "$1234", "airline": "Airline Name", "duration": "14h 30m", "stops": "1 stop", "bookingUrl": "https://www.google.com/flights" },
              "hotel": { "name": "Hotel Name", "pricePerNight": "$200", "rating": 4.5, "matchScore": 95, "bookingUrl": "https://www.google.com/travel/hotels" }
            }
          }
        `}
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  
  const text = response.text || "{}";
  const data = JSON.parse(text);
  
  // Generate high-quality proxy images
  const locImage = `https://image.pollinations.ai/prompt/cinematic%20travel%20photography%20${encodeURIComponent(data.location?.name || 'view')}?width=800&height=600&nologo=true&seed=${Math.random()}`;
  const hotelImage = `https://image.pollinations.ai/prompt/luxury%20hotel%20interior%20${encodeURIComponent(data.logistics?.hotel?.name || 'hotel')}?width=800&height=600&nologo=true&seed=${Math.random()}`;
  // Mock Street View (Use a slightly different seed or prompt style to distinguish from main image)
  const streetViewImage = `https://image.pollinations.ai/prompt/google%20street%20view%20photo%20of%20${encodeURIComponent(data.location?.name || 'street')}?width=400&height=400&nologo=true&seed=${Math.random()}`;

  // Mock Date logic for "Time Traveler"
  const futureMonth = new Date();
  futureMonth.setMonth(futureMonth.getMonth() + 4);
  const monthName = futureMonth.toLocaleString('default', { month: 'long' });
  const cheaperPrice = parseInt((data.logistics?.flight?.price || "$800").replace('$', '')) * 0.7;

  return {
    location: { 
      name: data.location?.name || "Unknown Location", 
      country: data.location?.country || "Earth", 
      airportCode: data.location?.airportCode || "JFK",
      realWorldImage: locImage,
      streetViewUrl: streetViewImage, // Fallback Feature A
      coordinates: { lat: 0, lng: 0 } 
    },
    logistics: {
      flight: { 
        price: data.logistics?.flight?.price || "$800",
        airline: data.logistics?.flight?.airline || "Generic Air",
        duration: data.logistics?.flight?.duration || "10h",
        stops: data.logistics?.flight?.stops || "Direct",
        departureTime: "10:00 AM",
        bookingUrl: "https://www.google.com/flights",
        cheapestOption: { // Fallback Feature B
            price: `$${Math.floor(cheaperPrice)}`,
            month: monthName,
            bookingUrl: "https://www.google.com/flights"
        }
      },
      hotel: { 
        name: data.logistics?.hotel?.name || "Cozy Stay",
        pricePerNight: data.logistics?.hotel?.pricePerNight || "$150",
        rating: data.logistics?.hotel?.rating || 4.5,
        matchScore: data.logistics?.hotel?.matchScore || 90,
        imageUrl: hotelImage,
        bookingUrl: "https://www.google.com/travel/hotels"
      }
    }
  };
};

/**
 * Initiates the analysis pipeline.
 */
const startAnalysisPipeline = async (file: File) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    console.log("Attempting to connect to backend...");
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: MOCK_UPLOAD_URL }), // In prod, use real uploaded URL
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    return await response.json();

  } catch (err) {
    console.error("Backend failed, switching to Client-Side Fallback:", err);
    return runClientSideFallback(file);
  }
};

export const identifyLocation = async (imageFile: File): Promise<LocationData> => {
  backendPromise = startAnalysisPipeline(imageFile);
  const data = await backendPromise;
  
  return {
    ...data.location,
    airportCode: data.location.airportCode || "AUS",
    coordinates: data.location.coordinates || { lat: 0, lng: 0 }
  };
};

export const analyzeVibe = async (imageFile: File, locationName: string): Promise<VibeData> => {
  const imagePart = await fileToGenerativePart(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        imagePart,
        { text: `Analyze the aesthetic vibe of this image (identified as ${locationName}). Provide 3-5 short vibe hashtags, a poetic description, and hex colors.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          aesthetics: {
            type: Type.OBJECT,
            properties: {
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const fetchTripDetails = async (location: LocationData): Promise<TripLogistics> => {
  if (!backendPromise) {
    throw new Error("Pipeline not initialized");
  }
  const data = await backendPromise;
  return data.logistics;
};
