export interface UserPreferences {
  id?: string;
  userId: string;
  species: string[];
  breeds: string[];
  size: string[];
  ageRange: [number, number];
  gender: string[];
  temperament: string[];
  activityLevel: string[];
  specialNeeds: boolean;
  housingType: string;
  yardSize: string;
  experienceLevel: string;
  timeAvailable: string;
  location: {
    type: 'current' | 'manual';
    coordinates?: [number, number];
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  maxDistance: number; // in miles
  createdAt?: string;
  updatedAt?: string;
}

export interface PetRecommendation {
  pet: Pet;
  score: number;
  matchReasons: string[];
  distance?: number;
}

export interface RecommendationFilters {
  minScore?: number;
  maxDistance?: number;
  species?: string[];
  sortBy?: 'score' | 'distance' | 'newest';
}