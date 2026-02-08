
import { MockScenario } from '../types';

export const SANTORINI_SCENARIO: MockScenario = {
  id: 'santorini-trap',
  // High-res Oia Sunset (The Dream)
  dreamImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop', 
  // Crowded Tourist Street (The Reality)
  realityImage: 'https://images.unsplash.com/photo-1605218427368-35b86d649363?q=80&w=1200&auto=format&fit=crop', 
  options: [
    {
      type: 'time-travel',
      title: 'Book for October for best price',
      location: 'Santorini, Greece',
      price: '$1,200',
      badge: 'Time Traveler Deal',
      savings: '$2,250',
      description: 'Same sunset. 60% fewer people.',
      imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop' // Calm beach vibe
    },
    {
      type: 'original',
      title: 'Santorini',
      location: 'Greece',
      price: '$3,450',
      badge: 'The Original',
      imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=800&auto=format&fit=crop'
    },
    {
      type: 'dupe',
      title: 'Sidi Bou Said',
      location: 'Tunisia',
      price: '$900',
      badge: '95% Vibe Match',
      savings: '$2,550',
      imageUrl: 'https://images.unsplash.com/photo-1549140600-78c9b8275445?q=80&w=800&auto=format&fit=crop'
    },
    {
      type: 'domestic',
      title: 'Alys Beach',
      location: 'Florida',
      price: '$450',
      badge: 'No Passport',
      imageUrl: 'https://images.unsplash.com/photo-1551523386-b41300806443?q=80&w=800&auto=format&fit=crop'
    }
  ]
};
