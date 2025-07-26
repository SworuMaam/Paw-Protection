export interface UserPreferences {
  id?: string;
  userId: string;
  species: string[];
  size: string[];
  ageRange: [number, number];
  gender: string[];
  temperament: string[];
  activityLevel: string[];
  housingType: string;
  yardSize: string;
  experienceLevel: string;
  timeAvailable: string;
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